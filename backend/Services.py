import ast

def insert_document_from_query(query_string):
    try:
        if ".insertOne(" in query_string:
            query_parts = query_string.split(".insertOne(")
        
        elif ".insertMany(" in query_string:
            query_parts = query_string.split(".insertMany(")

        else:
            return {"error": "Invalid MongoDB insert query"}
        
        collection_name = query_parts[0].split("db.")[1]
        document_str = query_parts[1].rsplit("})", 1)[0]
        document_dict = ast.literal_eval("{" + document_str + "}")

        collection = db[collection_name]

        if ".insertOne(" in query_string:
            result = collection.insert_one(document_dict)
        
        elif ".insertMany(" in query_string:
            result = collection.insert_many(document_dict)
        

        return {"message": "Document inserted successfully", "inserted_id": str(result.inserted_id)}
    except Exception as e:
        return {"error": str(e)}
    
    