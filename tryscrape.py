from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
import csv

driver = webdriver.Chrome(service=Service())
driver.maximize_window()

driver.get("https://opensea.io/category/gaming")
top_element = driver.find_element(By.CSS_SELECTOR, "[value='top']")
top_element.click()

nft_collections = []
item_elements = driver.find_elements(By.CSS_SELECTOR, "a[data-id='Item']")
for item_element in item_elements:
    image_element = item_element.find_element(By.CSS_SELECTOR, "img[alt='Collection Image']")
    image = image_element.get_attribute("src")

    rank_element = item_element.find_element(By.CSS_SELECTOR, "[data-id='TextBody']")
    rank = int(rank_element.text)

    name_element = item_element.find_element(By.CSS_SELECTOR, "[tabindex='-1']")
    name = name_element.text

    floor_price_element = item_element.find_element(By.CSS_SELECTOR, ".w-1\/5")
    floor_price = floor_price_element.text

    volume_column = item_element.find_elements(By.CSS_SELECTOR, ".w-1\/5")[1]

    volume_element = volume_column.find_element(By.CSS_SELECTOR, "[tabindex='-1']")
    volume = volume_element.text

    percentage_element = volume_column.find_element(By.CSS_SELECTOR, ".leading-sm")
    percentage = percentage_element.text

    nft_collection = {
        "rank": rank,
        "image": image,
        "name": name,
        "floor_price": floor_price,
        "volume": volume,
        "percentage": percentage
    }
    nft_collections.append(nft_collection)

nft_collections.sort(key=lambda x: x["rank"])
csv_filename = "nft_collections.csv"
with open(csv_filename, mode="w", newline="", encoding="utf-8") as file:
    writer = csv.DictWriter(file, fieldnames=nft_collections[0].keys())
    writer.writeheader()
    writer.writerows(nft_collections)

driver.quit()
