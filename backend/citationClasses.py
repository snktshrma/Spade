from datetime import datetime
from dateutil import parser as date_parser
class Datafinder:

    def __init__(self, soup):
        self._soup = soup

    def get_authors(self):
        authors = set()
        searches = [
                {'name': 'author'},
                {'property': 'article:author'},
                {'property': 'author'},
                {'rel': 'author'}
                ]

        author_elements = []
        for s in searches:
            author_elements += self._soup.find_all(attrs=s)

        for el in author_elements:
            author = self._get_data_from_element(el)
            if (len(author.split()) > 1):
                authors.add(author)

        authors_list = list(authors)
        return authors_list

    def get_title(self):
        searches = [
                {'property': 'og:title'}
                ]

        for s in searches:
            el = self._soup.find(attrs=s)
            if (el is not None):
                return self._get_data_from_element(el)

        return '[MISSING TITLE]'

    

    def _get_data_from_element(self, el):
        try:
            return el['content']
        except KeyError:
            return el.text

class Citation(object):

    __slots__ = [
            '_authors',
            '_pubdate',
            '_access_date',
            '_title',
            '_url'
            ]

    def __init__(self):
        self._authors = []

    @property
    def authors(self):
        return self._authors

    @authors.setter
    def authors(self, author):
        if (type(author) is list):
            self._authors += author
        else:
            self._authors.append(author)


    @property
    def publication_date(self):
        return self._pubdate

    @publication_date.setter
    def publication_date(self, value):
        self._pubdate = self._handle_date(value)
    @property
    def access_date(self):
        return self._access_date


    @access_date.setter
    def access_date(self, value):
        self._access_date = self._handle_date(value)

    @property
    def title(self):
        return self._title

    @title.setter
    def title(self, value):
        self._title = value

    @property
    def url(self):
        return self._url

    @url.setter
    def url(self, url):
        self._url = url

    def _handle_date(self, value):
        if (isinstance(value, datetime)):
            return value
        else:
            try:
                return date_parser.parse(value)
            except:
                return None
class APAFormatter():

    def format(self, citation):
        format = self._get_format()

        return format % (
            self._assemble_authors(citation.authors),
            self._format_pubdate(citation.publication_date),
            citation.title,
            self._format_accessdate(citation.access_date),
            citation.url
            )

    def _get_format(self):
        return "%s (%s). %s. Retrieved %s, from %s"

    def _get_author_format(self, authors):
        if (len(authors) == 0):
            return "[MISSING AUTHORS]"
        elif (len(authors) == 1):
            return "%s"
        elif (len(authors) == 2):
            return "%s, & %s"
        else:
            format_string = "%s, " * (len(authors)-1)
            return format_string + "& %s"

    def _assemble_authors(self, authors):

        formatted_names = set()

        for a in authors:
            first_last = a.split()
            if (len(first_last) > 1):
                # This pulls the last name and first initial
                formatted_names.add(first_last[1] + ", " + first_last[0][0] + ".")

        authors = list(formatted_names)
        if (len(authors) < 1):
            return "[MISSING AUTHORS]"

        authors.sort()

        formatted_authors = self._get_author_format(authors) % tuple(authors)
        return formatted_authors

    def _format_pubdate(self, date):
        if (date is not None):
            return date.strftime("%Y, %B %d")
        else:
            return "[MISSING PUBLICATION DATE]"

    def _format_accessdate(self, date):
        if (date is not None):
            return date.strftime("%B %d, %Y")
        else:
            return "[MISSING ACCESS DATE]"

