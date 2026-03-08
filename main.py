# import os
# from flask import Flask, jsonify, request
# from flask_sqlalchemy import SQLAlchemy
# from sqlalchemy import func
# from flask_cors import CORS
# from dotenv import load_dotenv
# import pandas as pd

# # Load .env only for local development
# load_dotenv()

# app = Flask(__name__)
# CORS(app)

# # Read DB URL from env
# DATABASE_URL = os.getenv("DATABASE_URL")

# if not DATABASE_URL:
#     raise ValueError("❌ DATABASE_URL is missing! Add it in Render Environment Variables.")

# app.config["SQLALCHEMY_DATABASE_URI"] = DATABASE_URL
# app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

# db = SQLAlchemy(app)



# # Create workflow model

# class Workflow(db.Model):
#     __tablename__ = "workflow"

#     id = db.Column(db.Integer, primary_key=True)
#     type = db.Column(db.String(100))
#     reportType = db.Column(db.String(100))
#     division = db.Column(db.String(100))
#     workflowType = db.Column(db.String(200))
#     initiator = db.Column(db.String(100))
#     approver1 = db.Column(db.String(100))
#     approver2 = db.Column(db.String(100))
#     approver3 = db.Column(db.String(100))
#     approver4 = db.Column(db.String(100))

# with app.app_context():
#     db.create_all()
    
# # clean value if any space present
# def clean_value(value):
#     if pd.isna(value):
#         return None
#     return str(value).strip()

# #Read the excel file
# @app.route("/upload_excel",methods=["POST"])
# def upload_excel():
#     try:
#         df=pd.read_excel("Wokflow_Corporate.xlsx")
#         # Remove extra spaces from column names
#         df.columns = df.columns.str.strip()

#         # Forward fill blank cells
#         df = df.ffill()

#         print(df.head()) # it will print the column first

#         # # delete old data 
#         # Workflow.query.delete() 
#         # db.session.commit()

#         # iterating each row of the excel
#         for index,row in df.iterrows():
#             new_record = Workflow(
#                 type=clean_value(row["Type"]),
#                 reportType=clean_value(row["Report Type"]),
#                 division=clean_value(row["Division"]),
#                 workflowType=clean_value(row["Workflow Type"]),
#                 initiator=clean_value(row["Initiator"]),
#                 approver1=clean_value(row["Approver 1"]),
#                 approver2=clean_value(row["Approver 2"]),
#                 approver3=clean_value(row["Approver 3"]),
#                 approver4=clean_value(row["Approver 4"]),
#             )
#             db.session.add(new_record)
        
#         db.session.commit()
#         return {"Status": "Success", "message": "Data uploaded successfully"}
#     except Exception as e:
#         return {"Status":"Error","message":str(e)}

# @app.route("/get_Workflow",methods=["GET"])
# def get_Workflow():
#     try:
#         type_val=request.args.get("type")
#         report_type=request.args.get("reportType")
#         division=request.args.get("division")
#         workflow_type=request.args.get("workflowType")

#         data = Workflow.query.filter(
#             func.lower(Workflow.type) == func.lower(type_val),
#             func.lower(Workflow.reportType) == func.lower(report_type),
#             func.lower(Workflow.division) == func.lower(division),
#             func.lower(Workflow.workflowType) == func.lower(workflow_type)
#         ).all()

#         if not data:
#             return {"Status":"not found"},404
        
#         result=[]
#         for w in data:
#             result.append({
#                 "division": w.division,
#                 "type": w.type,
#                 "reportType": w.reportType,
#                 "workflowType": w.workflowType,
#                 "initiator": w.initiator,
#                 "approver1": w.approver1,
#                 "approver2": w.approver2,
#                 "approver3": w.approver3,
#                 "approver4": w.approver4
#             })
#         return jsonify(result)
#     except Exception as e:
#         return {"Status": "Error", "message": str(e)}
    




# @app.route("/")
# def home():
#     return "✅ Flask is working excellent!"


# if __name__ == '__main__':
#     app.run(debug=True)




def func(items: list[str]) -> list[str]:
    return [i.isalnum() for i in items]
    
print(func(['saatwik']))