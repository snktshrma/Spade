import re
from htmldate import find_date
import requests
from bs4 import BeautifulSoup
import language_check
import datetime
import re

from textblob import TextBlob

e = 2.718281828459045

def site_score(url):
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
    #fix author search for both functions (check attribute and then names)
    #toolbar
    #highlight
    print(output)
    analysisSub = TextBlob(output).subjectivity
    bias_score=(1-analysisSub)*10

    authors = re.findall(r"[A-Z][a-z]+,?\s+(?:[A-Z][a-z]*\.?\s*)?[A-Z][a-z]+",  output)
    author_backing_score = 10 if len(authors) > 0 else 0

    original=find_date(url,original_date=True)
    update=find_date(url)
    relevance_score=0
    if(original is not None):
        today=datetime.datetime.today()
        date_format = "%Y-%m-%d"
        original_date = datetime.datetime.strptime(original, date_format)
        diff=(today-original_date).days
    
        relevance_score=10*pow(e,(-1/8000)*diff)
  
  
    tool = language_check.LanguageTool('en-US')
    mistakes = len(tool.check(output))

    mistakes_to_article = float(mistakes)/len(output)
    mistakes_score=10*pow(e,-20*mistakes_to_article)


    domains={
        ".edu":10,
        ".com":7,
        ".gov":10,
        ".org":8,
        ".net":8
    }
    url_score=0
    for i in domains:
        if(i in url):
            url_score=domains[i]
    if(len(url)>100):
        url_score-=(len(url)-100)*0.1
    if("~" in url):
        url_score*=0.6
    scores={"url_score":url_score,
    "mistakes_score":mistakes_score,
    "relevance_score":relevance_score,
    "author_score":author_backing_score,
    "bias_score":bias_score,
    "total":(url_score+mistakes_score+relevance_score+author_backing_score+bias_score)/5}
    #print("URL: "+str(url_score))
    #print("Mistakes: "+str(mistakes_score))
    #print("Relevance: "+str(relevance_score))
    #print("Author: " + str(author_backing_score))
    #print("Bias: " + str(bias_score)) 
    #print("Total Score: " +total)
    return scores
    #enter your research topic to determine relevance of this site
#site_score("https://www.pbs.org/crucible/tl5.html")