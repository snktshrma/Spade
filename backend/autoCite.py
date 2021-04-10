import requests
from bs4 import BeautifulSoup
from citationClasses import Citation,APAFormatter,Datafinder
from htmldate import find_date

import datetime
import sys

def url_to_soup(url):
    # Some websites are unhappy with no user agent, so here's
    # one that looks nice.
    header = {'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.9; rv:32.0) Gecko/20100101 Firefox/32.0',}

    try:
        page = requests.get(url)
        return BeautifulSoup(page.text, 'html.parser')
    except Exception as e:
        print(e)
        return None

def soup_to_citation(url, soup):
    df = Datafinder(soup)

    citation = Citation()
    citation.authors = df.get_authors()
    citation.title = df.get_title()
    citation.access_date = datetime.datetime.now()
    date=find_date(url)
    date_format = "%Y-%m-%d"
    date = datetime.datetime.strptime(date, date_format)
    citation.publication_date = date.strftime("%Y, %B %d")
    citation.url = url
    return citation

def cite(url):




    formatter = APAFormatter()

    soup = url_to_soup(url)
    citation = soup_to_citation(url, soup)

    return formatter.format(citation)

    
       
#cite("http://arstechnica.com/business/2012/12/report-data-caps-just-a-cash-cow-for-internet-providers/")