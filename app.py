from flask import Flask, render_template, request, jsonify
import json
from difflib import get_close_matches
from typing import List, Dict, Optional

app = Flask(__name__)

# Load the knowledge base from a JSON file
def load_knowledge_base(file_path: str) -> Dict:
    with open(file_path, 'r') as file:
        return json.load(file)

# Load knowledge base on app start
knowledge_base = load_knowledge_base('knowledge_base.json')

# Function to find the closest match from the user's question
def find_best_match(user_question: str, questions: List[str]) -> Optional[str]:
    matches = get_close_matches(user_question, questions, n=1, cutoff=0.6)
    if matches:
        return matches[0]
    return None

# Home route to serve the HTML page
@app.route('/')
def home():
    return render_template('index.html')

# API endpoint for processing the chat messages
@app.route('/get_response', methods=['POST'])
def get_response():
    user_question = request.json.get('message')  # Extract the message from the JSON request
    questions = [q["question"] for q in knowledge_base["questions"]]
    
    # Find the best match for the user's question
    best_match = find_best_match(user_question, questions)
    
    if best_match:
        # Get the answer based on the matched question
        answer = next((q["answer"] for q in knowledge_base["questions"] if q["question"] == best_match), "I don't have an answer for that.")
    else:
        answer = "I don't have an answer for that."
    
    return jsonify({"response": answer})

if __name__ == '__main__':
    app.run(debug=True)
