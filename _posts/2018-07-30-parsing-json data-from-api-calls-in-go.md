---
layout: post
title: "Parsing JSON Data From API Calls in Go"
comments: true
description: "Based on my experience learning Go, a tutorial on how to parse JSON data from calling an API."
keywords: "Go, JSON, API, parse"
---

Parsing JSON data with Go is not straightforward if you're a beginner to the language. There are tons of "hello world" level tutorials out there to give you an introduction to JSON parsing in Go, but not many practical ones. This post will serve those who desire a practical example. Prerequisite knowledge would be the basics of Go (if not, read [The Little Go Book](https://github.com/karlseguin/the-little-go-book)) and some API basics (GET requests).

Go is a *statically* typed language. This is what makes it difficult to parse something that is potentially dynamic (unknown at compile time, because we have yet to receive the data until we call it). You will find plenty of examples online that show you how to parse static JSON objects (i.e. ones with finite and expected values).

So instead let's call an API to show you how to transform a reasonably complex JSON response object into a Go object that your Go program will be able to use.

Head over to the [CoinMarketCap API](https://coinmarketcap.com/api/) and look at the *Listings* API. 

```json
{
    "data": [
        {
            "id": 1, 
            "name": "Bitcoin", 
            "symbol": "BTC", 
            "website_slug": "bitcoin"
        }, 
        {
            "id": 2, 
            "name": "Litecoin", 
            "symbol": "LTC", 
            "website_slug": "litecoin"
        }, 
        ...
    ],
    "metadata": {
        "timestamp": 1525137187, 
        "num_cryptocurrencies": 1602, 
        "error": null
    }
}
```

```javascript
var modularpattern = (function() {
    // your module code goes here
    var sum = 0 ;

    return {
        add:function() {
            sum = sum + 1;
            return sum;
        },
        reset:function() {
            return sum = 0;    
        }  
    }   
}());
alert(modularpattern.add());    // alerts: 1
alert(modularpattern.add());    // alerts: 2
alert(modularpattern.reset());  // alerts: 0
```

Using this API call, we can access all the cryptocurrencies listed on the site in a array of JSON objects called `data`. What makes this example different than most others I've seen online, is the fact that this API returns a large response JSON object of unknown size (denoted by the `...` in the code). That is, there are more than a thousand cryptocurrencies listed, and the number can (and will) change over time (this is actually denoted in the `metadata` field under `num_cryptocurrencies`).



## The Boilerplate Code

We start with the following boilerplate code to set up our API request.

```go
// TODO: Create struct for Listings

func main() {
	url := "https://api.coinmarketcap.com/v2/listings"

	client := http.Client{
		Timeout: time.Second * 2, // Maximum of 2 secs
	}

	req, err := http.NewRequest(http.MethodGet, url, nil)

	if err != nil {
		log.Fatal(err)
	}

	// some APIs require a User Agent to determine access purpose
	req.Header.Set("User-Agent", "cryptotrackr-test")

	res, getErr := client.Do(req)
	if getErr != nil {
		log.Fatal(getErr)
	}

	// Close when done reading from it, defer this action.
	defer res.Body.Close()

    // Read from res.Body into body, which is of type []byte.
	body, readErr := ioutil.ReadAll(res.Body)
	if readErr != nil {
		log.Fatal(readErr)
	}

	list := Listings{}

    // TODO: Unmarshal the data.

}
```

We still have two parts we need to finish that are implementation dependent; declaring the Go `struct` to hold the data and [Unmarshaling](https://golang.org/pkg/encoding/json/#Unmarshal) the data.

There are two ways to Unmarshal the JSON data; the practical way and the hard-but-informative way. For implementation purposes, I would use the practical way, but if you want to learn how Go handles recieved JSON data, read the hard-but-informative way.

## The Practical Way

Matt Holt made a fantastic tool called [JSON-to-Go](https://mholt.github.io/json-to-go/) that will create a Go struct for parsing the JSON data in the shorthand backtick notation that Go offers. (I wish I knew about this site before I attempted this the hard way 😩)

```go
type Listings struct {
	Data []struct {
		ID          int    `json:"id"`
		Name        string `json:"name"`
		Symbol      string `json:"symbol"`
		WebsiteSlug string `json:"website_slug"`
	} `json:"data"`
	Metadata struct {
		Timestamp           int         `json:"timestamp"`
		NumCryptocurrencies int         `json:"num_cryptocurrencies"`
		Error               interface{} `json:"error"`
	} `json:"metadata"`
}
```

Putting the API example return code in the JSON-to-Go converter should output that `struct`. 

All we need to do is to use the default `json.Unmarshal` method, and Go will take care of all the hard stuff for us by matching the key-value pairs to their corresponding JSON fields.

The finished code will look like so:

```go
package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
)

// Go struct for the Listings
// Note: fields must be a capital letter to be encoded.
type Listings struct {
	Data []struct {
		ID          int    `json:"id"`
		Name        string `json:"name"`
		Symbol      string `json:"symbol"`
		WebsiteSlug string `json:"website_slug"`
	} `json:"data"`
	Metadata struct {
		Timestamp           int         `json:"timestamp"`
		NumCryptocurrencies int         `json:"num_cryptocurrencies"`
		Error               interface{} `json:"error"`
	} `json:"metadata"`
}

func main() {
	url := "https://api.coinmarketcap.com/v2/listings"

	client := http.Client{
		Timeout: time.Second * 2, // Maximum of 2 secs
	}

	req, err := http.NewRequest(http.MethodGet, url, nil)

	if err != nil {
		log.Fatal(err)
	}

	// some APIs require a User Agent to determine access purpose
	req.Header.Set("User-Agent", "cryptotrackr-test")

	res, getErr := client.Do(req)
	if getErr != nil {
		log.Fatal(getErr)
	}

	// Close when done reading from it, defer this action.
	defer res.Body.Close()

    // Read from res.Body into body, which is of type []byte.
	body, readErr := ioutil.ReadAll(res.Body)
	if readErr != nil {
		log.Fatal(readErr)
	}

	list := Listings{}

    // Unmarshal the data.
	jsonErr := json.Unmarshal(body, &list)
	if jsonErr != nil {
		log.Fatal(jsonErr)
	}
}
```



## The Hard-But-Informative Way

*Warning: the practical way is much quicker, cleaner, and overall better for unmarshaling the JSON data. However, reading this method will allow you to better understand how to do more complex unmarshaling in Go*. 

If you look over some of the [official documentation](https://blog.golang.org/json-and-go) and [this useful post at eager.io](https://eager.io/blog/go-and-json/), you will see that most JSON objects that consist of key-value pairs could be defined as a `map[string]interface{}` type in Go. This is because the key is usually a `string`, and the value is typically unknown. When we aren't sure of something's type, we use the generic `interface{}` type to characterize it. An example in this API of why would would use `map[string]interface{}` is the in the `metadata` field.

```go
"metadata": {
    "timestamp": 1525137187, 
    "num_cryptocurrencies": 1602, 
    "error": null
}
```

Looking back at the API example return, we see that `timesamp` is paied to a number, whilst `error` would be paired to a `string` (if the value is non-null). 

Because this map of key-value pairs could have numeric or string values, we use the generic `interface{}` type. This gives us the flexibility of assigning types to our generic interfaces using *type inference*.

Therefore our objective is to handle these discrepencies by creating and utilizing a custom Unmarshal method.

```go
package main

import (
	"encoding/json"
	"fmt"
	"github.com/mitchellh/mapstructure" // for decoding objects into maps.
	"io/ioutil"
	"log"
	"net/http"
	"strings" // use for UnmarshalJSON
	"time"
)

type Listings struct {
	Data []struct {
		ID          int    
		Name        string 
		Symbol      string 
		WebsiteSlug string
	}
	Metadata struct {
		Timestamp           int         
		NumCryptocurrencies int         
		Error               interface{} 
	} 
}

// Custom Unmarshal method for objects of type Listings.
func (l *Listings) UnmarshalJSON(raw []byte) error {
	// Going to store JSON here later as a map of strings to interfaces (interface is used for unknown types).
	var rawListings map[string]interface{}

	// Unmarshal raw byte array into our map.
	err := json.Unmarshal(raw, &rawListings)
	if err != nil {
		return err
	}

	// Extract data from JSON object.
	for key, val := range rawListings {
		if strings.ToLower(key) == "metadata" {
			// Need to characterize val as type map[string]interface{} with type inference to use as method argument.
			v := val.(map[string]interface{})

			// Convert map[string]interface{} into objects using Hashicorp's mapstructure.Decode(in, out) method.
			mapstructure.Decode(v, &l.Metadata)
		}
		if strings.ToLower(key) == "data" {
			// Convert all of the Tickrs in the returned JSON array.
			var newTickr Tickr
			for tickr := range val.([]interface{}) {
				// Copy data into a tickr object.
				mapstructure.Decode(tickr, &newTickr)
				// Append it to the slice of Tickrs.
				l.Tickrs = append(l.Tickrs, newTickr)
			}
		}
	}

	return nil
}



func main() {
	url := "https://api.coinmarketcap.com/v2/listings"

	client := http.Client{
		Timeout: time.Second * 2, // Maximum of 2 secs
	}

	req, err := http.NewRequest(http.MethodGet, url, nil)

	if err != nil {
		log.Fatal(err)
	}

	// some APIs require a User Agent to determine access purpose
	req.Header.Set("User-Agent", "cryptotrackr-test")

	res, getErr := client.Do(req)
	if getErr != nil {
		log.Fatal(getErr)
	}

	// Close when done reading from it, defer this action.
	defer res.Body.Close()

    // Read from res.Body into body, which is of type []byte.
	body, readErr := ioutil.ReadAll(res.Body)
	if readErr != nil {
		log.Fatal(readErr)
	}

	list := Listings{}

    // Unmarshal the data.
    jsonErr := list.UnmarshalJSON(body)
        if jsonErr != nil {
            log.Fatal(jsonErr)
        }
}
```

*Note: we use the Go package [github.com/mitchellh/mapstructure](https://github.com/mitchellh/mapstructure), so make sure to install it.* 

Notice how we call our custom method. Since it belongs to our list object, we call `list.UnmarshalJSON()`. 



## Conclusion

I learned a lot by doing the is the hard way, but it taught me a lot about how to handle types in a flexible way using interfaces.

However, I would've picked the practical way the first time around if I knew about using the amazing [JSON-to-Go](https://mholt.github.io/json-to-go/) tool to unmarshal the JSON data in a straightforward way.

Hopefully this post will pass on the knowledge I gained without the time commitment or stress!

## References

For further reading and explanation, check these references. Some of the code used in these examples comes from the blog posts by IndianGuru and AlexEllis. For more explanation about JSON and Go, check the eager.io and golang.org posts.

[blog.alexellis.io/golang-json-api-client/](https://blog.alexellis.io/golang-json-api-client/)

[Consuming JSON APIs with Go by IndianGuru](https://medium.com/@IndianGuru/consuming-json-apis-with-go-d711efc1dcf9) 

[eager.io/blog/go-and-json/](https://eager.io/blog/go-and-json/)

[blog.golang.org/json-and-go](https://blog.golang.org/json-and-go)

[JSON-to-Go](https://mholt.github.io/json-to-go/)

