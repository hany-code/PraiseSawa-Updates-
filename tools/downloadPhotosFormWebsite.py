import os
import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin, urlparse
import re

def sanitize_filename(filename):
    """Sanitize the filename by removing or replacing invalid characters."""
    filename = re.sub(r'[\\/*?:"<>|]', "", filename)
    return filename

def is_logo_image(img_url):
    """Check if the image URL is likely to be a logo image."""
    # Refine criteria based on your knowledge of the website
    return 'logo' in img_url.lower() or 'favicon' in img_url.lower()

def download_images(url, folder):
    response = requests.get(url)
    soup = BeautifulSoup(response.text, 'html.parser')
    
    # Find all links containing images
    links = soup.find_all('a', href=True)
    
    if not os.path.exists(folder):
        os.makedirs(folder)
    
    downloaded_images = 0
    images_on_page = 0

    for link in links:
        # Check if the link contains an image
        img_tag = link.find('img')
        if img_tag:
            high_res_url = urljoin(url, link['href'])
            img_response = requests.get(high_res_url)
            img_soup = BeautifulSoup(img_response.text, 'html.parser')
            high_res_img_tag = img_soup.find('img')
            if high_res_img_tag:
                img_url_high_res = urljoin(high_res_url, high_res_img_tag['src'])
                
                # Check if this image is a logo
                if not is_logo_image(img_url_high_res):
                    images_on_page += 1
                    img_alt_text = high_res_img_tag.get('alt', 'image')
                    img_title_text = high_res_img_tag.get('title', 'image')
                    img_name_text = sanitize_filename(img_alt_text or img_title_text)
                    img_extension = os.path.splitext(urlparse(img_url_high_res).path)[1]
                    img_name = os.path.join(folder, f"{img_name_text}{img_extension}")
                    
                    with open(img_name, 'wb') as f:
                        img_data = requests.get(img_url_high_res).content
                        f.write(img_data)
                        downloaded_images += 1
    
    if downloaded_images == 0 or images_on_page == 1:
        print(f"Only one image or no useful images found on {url}. Skipping to the next category.")
        return 0
    
    print(f"Downloaded {downloaded_images} high-quality images from {url}")
    return downloaded_images

def download_from_multiple_links(base_url, start_id, end_id, pagination_steps, folder):
    for category_id in range(start_id, end_id + 1):
        page_start = 0
        while True:
            url = f"{base_url}{category_id}"
            if page_start > 0:
                url += f"/start-{page_start}"
            print(f"Processing URL: {url}")
            images_downloaded = download_images(url, folder)
            if images_downloaded == 0:
                print(f"No useful images found on {url}. Moving to the next category.")
                break
            page_start += pagination_steps
            # Break the loop if the next page does not exist or is empty
            if images_downloaded == 0:
                break

# Base URL and folder to save images
base_url = 'https://www.chordat.com/index.php?/category/'
start_id = 41
end_id = 41
pagination_steps = 20
folder = 'downloaded_images'

download_from_multiple_links(base_url, start_id, end_id, pagination_steps, folder)
