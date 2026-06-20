import os
import sys
import re
import urllib.request
import urllib.parse

def fetch_svg(keyword, filename=None):
    if not filename:
        filename = keyword + ".svg"
    
    # URL encode the keyword
    encoded_keyword = urllib.parse.quote(keyword)
    search_url = f"https://www.svgrepo.com/vectors/{encoded_keyword}/"
    
    print(f"Searching SVG Repo for '{keyword}' at: {search_url}")
    
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    }
    
    try:
        req = urllib.request.Request(search_url, headers=headers)
        with urllib.request.urlopen(req, timeout=10) as response:
            html = response.read().decode('utf-8')
            
        # Look for SVG URLs on the page
        # SVGs are typically hosted on: https://www.svgrepo.com/show/... or https://www.svgrepo.com/svg/... or static content domains
        # Let's search for patterns like https://www.svgrepo.com/show/XXXXXX/name.svg or CDN links
        # Match URL patterns: https://www.svgrepo.com/show/\d+/[^"]+\.svg or CDN links like https://www.svgrepo.com/svg/\d+/[^"]+\.svg
        svg_urls = re.findall(r'https://www\.svgrepo\.com/show/\d+/[^"\s]+\.svg', html)
        if not svg_urls:
            # Fallback to CDN URL matches
            svg_urls = re.findall(r'https://www\.svgrepo\.com/svg/\d+/[^"\s]+\.svg', html)
            
        if not svg_urls:
            # Check for direct src links
            svg_urls = re.findall(r'src="([^"]+\.svg)"', html)
            
        if not svg_urls:
            print(f"No SVGs found for '{keyword}' on SVG Repo.")
            return False
            
        # Pick the first matching URL
        target_url = svg_urls[0]
        # Resolve relative URLs
        if target_url.startswith('//'):
            target_url = 'https:' + target_url
        elif target_url.startswith('/'):
            target_url = 'https://www.svgrepo.com' + target_url
            
        print(f"Found SVG URL: {target_url}")
        
        # Download the SVG content
        req_svg = urllib.request.Request(target_url, headers=headers)
        with urllib.request.urlopen(req_svg, timeout=10) as response_svg:
            svg_content = response_svg.read().decode('utf-8')
            
        # Clean up XML headers if present
        clean_svg = re.sub(r'<\?xml.*?\?>', '', svg_content)
        clean_svg = re.sub(r'<!--.*?-->', '', clean_svg, flags=re.DOTALL)
        clean_svg = clean_svg.strip()
        
        # Ensure directories exist
        dest_dir = "./src/assets/icons"
        os.makedirs(dest_dir, exist_ok=True)
        
        dest_path = os.path.join(dest_dir, filename)
        with open(dest_path, 'w', encoding='utf-8') as f:
            f.write(clean_svg)
            
        print(f"Successfully saved clean SVG to {dest_path}")
        return True
        
    except Exception as e:
        print(f"Error fetching SVG from SVG Repo: {e}")
        return False

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python fetch_svg.py <keyword> [filename]")
        sys.exit(1)
        
    kw = sys.argv[1]
    fn = sys.argv[2] if len(sys.argv) > 2 else None
    success = fetch_svg(kw, fn)
    sys.exit(0 if success else 1)
