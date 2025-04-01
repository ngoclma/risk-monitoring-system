from app import app, db
from models import Client, Position, MarketData, Margin
from datetime import datetime

def seed_database():
    with app.app_context():
        # Clear existing data
        db.session.query(Position).delete()
        db.session.query(Margin).delete()
        db.session.query(Client).delete()
        db.session.query(MarketData).delete()
        
        # Create client
        client = Client(name="John Doe", email="john@example.com")
        db.session.add(client)
        db.session.flush()  # To get client ID
        
        # Create positions
        positions = [
            Position(symbol="AAPL", quantity=100, cost_basis=150.0, client_id=client.id),
            Position(symbol="MSFT", quantity=50, cost_basis=280.0, client_id=client.id),
            Position(symbol="AMZN", quantity=20, cost_basis=3200.0, client_id=client.id),
        ]
        db.session.add_all(positions)
        
        # Create market data
        market_data = [
            MarketData(symbol="AAPL", current_price=155.0, timestamp=datetime.utcnow()),
            MarketData(symbol="MSFT", current_price=285.0, timestamp=datetime.utcnow()),
            MarketData(symbol="AMZN", current_price=3250.0, timestamp=datetime.utcnow()),
        ]
        db.session.add_all(market_data)
        
        # Create margin
        margin = Margin(loan_amount=20000.0, margin_requirement_rate=0.25, client_id=client.id)
        db.session.add(margin)
        
        db.session.commit()
        print("Database seeded successfully!")

if __name__ == "__main__":
    seed_database()