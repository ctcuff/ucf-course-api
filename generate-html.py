# Helper script used to generate the HTML files found in
# src/__mocks__/. This is used so that the scraper doesn't have
# to make numerous requests to UCF's course site.
import os
import urllib.request


BASE_URL = 'https://centralflorida-prod.modolabs.net/student/course_search_prod'
paths = {
    'ABC2000': f'{BASE_URL}/detail?area=ABC&course=ABC%202000',
    'ENC1101': f'{BASE_URL}/detail?area=ENC&course=ENC%201101',
    'catalog': f'{BASE_URL}/catalog',
    'COP': f'{BASE_URL}/catalog?area=COP'
}


def write_html_response(filename, url):
    print(f'Requesting {url}...')

    with urllib.request.urlopen(url) as response:
        with open(f'./src/__mocks__/{filename}.html', 'w') as file:
            file.write(
                f'<!-- Request from: {url} -->\n'
                f'{response.read().decode("utf8")}'
            )


if __name__ == '__main__':
    os.makedirs('./src/__mocks__', exist_ok=True)

    for key, url in paths.items():
        write_html_response(key, url)
