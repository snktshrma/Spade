from transformers import pipeline
import re
from bs4 import BeautifulSoup
import requests

def questionAnswer(context, question):
    question_answering = pipeline("question-answering")

    result = question_answering(question=question, context=context)

    answer = result['answer']
    score = result['score']
    
    return score, answer

def getAnswer(question,url):
    res = requests.get(url)
    html_page = res.content
    soup = BeautifulSoup(html_page, 'html.parser')
    text = soup.find_all(text=True)
    output = ''

    allowed=[
        "p",
        "span",
        "li",
        #"h1",
        #"h2",
        #"h3",
        #"h4",
        #"h5",
        "div",
        "a"
    ]
    for t in text:
        if t.parent.name in allowed:
            output += '{} '.format(re.sub('[^a-zA-Z0-9-_*. ?:()!]', '', t))
    score,answer=questionAnswer(question,output)
    return answer
