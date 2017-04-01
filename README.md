# Subvertise

Subvertise is an open-source response to the [recent 
bill](http://www.theverge.com/2017/3/29/15100620/congress-fcc-isp-web-browsing-privacy-fire-sale) 
repealing FCC privacy controls for the internet. 

If ISPs can sell your browsing data to advertisers, 
what value with that data have if it's full of false-visits? 

## How it works

Subvertise just runs in the background, randomly visiting a list of 
random (but safe) websites for random amounts of time. 

You can modify the list of websites to add some spice to it.

When ISPs sell your browsing history, they'll be selling a large list
of random websites, with your actual visits mixed in. Advertisers
won't know what you're really visiting, foiling their sinister plans. 

# Frequently Asked Questions

## Why does this load whole websites instead of just a URL? 

If Subvertise just hit [facebook.com](https://facebook.com) instead of
loading the page, then all the other domains (cdns, ads, etc) would not be 
loaded, and ISPs would know this wasn't a legitimate visit. 

So, it loads the whole page to *fool em good*. 

## Doesn't this generate a lot of wasted traffic? 

You betcha! What's your privacy worth to you? Unless you pay per MB 
(and very few people do), this shouldn't be much of a concern. 
It's not streaming video or downloading huge files.
