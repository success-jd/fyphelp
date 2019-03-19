var searchField = document.querySelector(".search-box"),
    searchView = document.querySelector(".main-body"),
    resultsView = document.querySelector(".search-results"),
    resultsList = document.querySelector(".search-results .results-list"),
    closeResultsView = resultsView.querySelector(".close"),
    loader = document.querySelector(".svg-loader");

function search(query, callback) {
    loader.classList.add("active");
    fetch("https://tools.cdc.gov/api/v2/resources/media?q=" + query + "&format=json", {
        method: "GET",
        mode: "cors"
    })
    .then(function(res) {
        if(res.status === 200) {
            res.json()
            .then(function(data) {
                loader.classList.remove("active");
                callback(data);
            })
        }
    })
    .catch(function(err) {
        console.log(err);
    })
}

closeResultsView.addEventListener("click", function() {
    resultsView.classList.remove("active");
    searchView.classList.add("active");
})

searchField.addEventListener("submit", function(e) {
    e.preventDefault();
    var query = this.elements.query.value;
    if(query === "") {
        return;
    }
    //search
    search(query, function(data) {
        if(data.results.length === 0) {
            alert("no results found");
        } else {
            resultsList.innerHTML = "";
            data.results.forEach(function(result) {
                if(result.mediaType !== "Podcast") {
                    var item = genResult(result);
                    resultsList.appendChild(item);
                }
            })
            //show results view
            searchView.classList.remove("active");
            resultsView.classList.add("active");
        }
    })
})

function genResult(data) {
    var a = document.createElement("a");
    a.setAttribute("href", data.contentUrl);
    a.setAttribute("target", "_blank");
    var li = document.createElement("li");
    li.classList.add("result");
    var header = document.createElement("h3");
    header.classList.add("header");
    header.innerText = data.name;
    var body = document.createElement("p");
    body.classList.add("body");
    body.innerText = data.description;
    li.appendChild(header);
    li.appendChild(body);
    a.appendChild(li);
    return a;
}