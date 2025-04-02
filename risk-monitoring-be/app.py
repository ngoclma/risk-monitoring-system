from flask import Flask, request, jsonify
from flask_cors import CORS
from models import db, Client, Position, MarketData, Margin
import os
from dotenv import load_dotenv
import requests
import threading
import datetime
import time

load_dotenv()

app = Flask(__name__)
CORS(app)

# Database configuration
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:password@localhost/risk_monitoring'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)

with app.app_context():
    db.create_all()

# Market data API config
MARKET_API_KEY = os.getenv('MARKET_API_KEY')
MARKET_API_URL = "https://api.twelvedata.com/price"

@app.route('/api/market-data', methods=['GET'])
def get_market_data():
    market_data = MarketData.query.all()
    result = []
    
    for data in market_data:
        result.append({
            'symbol': data.symbol,
            'current_price': data.current_price,
            'timestamp': data.timestamp
        })
        
    return jsonify(result)

def fetch_market_data():
    with app.app_context():
        # Get all unique symbols from positions table
        symbols = [pos.symbol for pos in Position.query.with_entities(Position.symbol).distinct()]
        
        for symbol in symbols:
            try:
                params = {
                    'symbol': symbol,
                    'apikey': MARKET_API_KEY
                }
                response = requests.get(MARKET_API_URL, params=params)
                data = response.json()
                
                # Update or insert market data
                market_data = MarketData.query.filter_by(symbol=symbol).first()
                if market_data:
                    market_data.current_price = float(data['price'])
                    market_data.timestamp = datetime.utcnow()
                else:
                    new_data = MarketData(
                        symbol=symbol,
                        current_price=float(data['price'])
                    )
                    db.session.add(new_data)
                    
                db.session.commit()
            except Exception as e:
                print(f"Error fetching market data for {symbol}: {e}")

def start_market_data_thread():
    def run_market_data_updates():
        while True:
            fetch_market_data()
            time.sleep(60)  # Update every minute
            
    thread = threading.Thread(target=run_market_data_updates)
    thread.daemon = True
    thread.start()

@app.route('/api/positions/<int:client_id>', methods=['GET'])
def get_client_positions(client_id):
    positions = Position.query.filter_by(client_id=client_id).all()
    result = []
    
    for pos in positions:
        # Get latest market price
        market_data = MarketData.query.filter_by(symbol=pos.symbol).first()
        current_price = market_data.current_price if market_data else pos.cost_basis
        
        result.append({
            'id': pos.id,
            'symbol': pos.symbol,
            'quantity': pos.quantity,
            'cost_basis': pos.cost_basis,
            'current_price': current_price,
            'market_value': pos.quantity * current_price
        })
        
    return jsonify(result)

@app.route('/api/positions', methods=['POST'])
def create_position():
    data = request.json
    
    new_position = Position(
        symbol=data['symbol'],
        quantity=data['quantity'],
        cost_basis=data['cost_basis'],
        client_id=data['client_id']
    )
    
    db.session.add(new_position)
    db.session.commit()
    
    return jsonify({'message': 'Position created successfully'}), 201

@app.route('/api/margin-status/<int:client_id>', methods=['GET'])
def get_margin_status(client_id):
    # Get client's positions
    positions = Position.query.filter_by(client_id=client_id).all()
    
    # Get client's margin information
    margin = Margin.query.filter_by(client_id=client_id).first()
    
    if not margin:
        return jsonify({'error': 'Margin information not found for this client'}), 404
    
    # Calculate portfolio market value
    portfolio_market_value = 0
    position_details = []
    
    for pos in positions:
        # Get current market price
        market_data = MarketData.query.filter_by(symbol=pos.symbol).first()
        current_price = market_data.current_price if market_data else pos.cost_basis
        
        # Calculate position value
        position_value = pos.quantity * current_price
        portfolio_market_value += position_value
        
        position_details.append({
            'symbol': pos.symbol,
            'quantity': pos.quantity,
            'current_price': current_price,
            'position_value': position_value
        })
    
    # Calculate margin status
    loan_amount = margin.loan_amount
    net_equity = portfolio_market_value - loan_amount
    margin_requirement = margin.margin_requirement_rate * portfolio_market_value
    margin_shortfall = margin_requirement - net_equity
    margin_call_triggered = margin_shortfall > 0
    
    result = {
        'portfolio_market_value': portfolio_market_value,
        'loan_amount': loan_amount,
        'net_equity': net_equity,
        'margin_requirement': margin_requirement,
        'margin_shortfall': margin_shortfall,
        'margin_call_triggered': margin_call_triggered,
        'positions': position_details
    }
    
    return jsonify(result)

@app.route('/api/loan/pay', methods=['POST'])
def pay_loan():
    data = request.json
    client_id = data.get('client_id')
    payment_amount = data.get('payment_amount')

    if not client_id or not payment_amount:
        return jsonify({'error': 'Missing client_id or payment_amount'}), 400

    margin = Margin.query.filter_by(client_id=client_id).first()
    if not margin:
        return jsonify({'error': 'Margin information not found for this client'}), 404

    if payment_amount > margin.loan_amount:
        return jsonify({'error': 'Payment amount exceeds loan amount'}), 400

    margin.loan_amount -= payment_amount
    db.session.commit()

    return jsonify({'message': 'Loan payment successful', 'new_loan_amount': margin.loan_amount}), 200

@app.route('/api/loan/increase', methods=['POST'])
def increase_loan():
    data = request.json
    client_id = data.get('client_id')
    loan_increase_amount = data.get('loan_increase_amount')

    if not client_id or not loan_increase_amount:
        return jsonify({'error': 'Missing client_id or loan_increase_amount'}), 400

    margin = Margin.query.filter_by(client_id=client_id).first()
    if not margin:
        return jsonify({'error': 'Margin information not found for this client'}), 404

    margin.loan_amount += loan_increase_amount
    db.session.commit()

    return jsonify({'message': 'Loan increase successful', 'new_loan_amount': margin.loan_amount}), 200

# Start market data thread when app is running
if __name__ == '__main__':
    start_market_data_thread()
    app.run(debug=True)