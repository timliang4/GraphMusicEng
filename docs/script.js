function recommendations(form, results, inp, load) {
    async function getRecommendations(search) {
        try {
            const response = await fetch(`https://trackmatchapi.com/music?track=${search}`);
            if (!response.ok) {
              throw new Error(`Response status: ${response.status}`);
            }
            const result = await response.json();
            return result["recommendations"]
        } catch (error) {
            console.error(error.message);
        }
    }
    form.addEventListener('submit', (e) => {
        e.preventDefault()
        var b, c, i, j, recs;
        let search = inp.value;
        if (!search) {alert("Please enter a track into the search box."); return false;}
        clearRecommendations()
        load.style.display = 'block';
        getRecommendations(search)
            .then((trackRecs) => {
                if (trackRecs.length == 0) {alert(`${search} not found in database. Please try another track.`); return false;}
                for (i = 0; i < trackRecs.length; i++) {
                    b = document.createElement("DIV");
                    b.setAttribute("class", "recommendation-list"); 
                    b.innerHTML = `Recommendations for: <strong><a href="https://open.spotify.com/track/${trackRecs[i]["uri"]}" target="_blank">${trackRecs[i]["name"]}</a></strong> by ${trackRecs[i]["artist"]}<br />`
                    recs = trackRecs[i]["recommendations"] 
                    for (j = 0; j < recs.length; j++) {
                        c = document.createElement("DIV")
                        c.setAttribute("class", "recommendation");
                        c.innerHTML += `${recs[j]["frequency"]} Connection${(recs[j]["frequency"] > 1) ? "s" : ""}: <a href="https://open.spotify.com/track/${recs[j]["uri"]}" target="_blank">${recs[j]["name"]}</a> - <em>${recs[j]["artist"]}</em>`
                        b.appendChild(c)
                    }
                    results.appendChild(b)
                }
                load.style.display = 'none'
            })
            .catch(e => {console.log(e); alert("Error occurred while loading data. Check console for details.")})
    })

    function clearRecommendations() {
        results.textContent = '';
    }
}

function autocomplete(inp) {
    async function getSearchData(search) {
        try {
            const response = await fetch(`https://trackmatchapi.com/track?search=${search}`);
            if (!response.ok) {
              throw new Error(`Response status: ${response.status}`);
            }
            const result = await response.json();
            return result["tracksFound"]
        } catch (error) {
            console.error(error.message);
        }
    }
    var currentFocus;
    inp.addEventListener("input", function(e) {
        var a, b, i, val = this.value;
        closeAllLists();
        if (!val) { return false;}
        currentFocus = -1;
        a = document.createElement("DIV");
        a.setAttribute("id", this.id + "autocomplete-list");
        a.setAttribute("class", "autocomplete-items");
        this.parentNode.appendChild(a);
        getSearchData(val)
            .then((arr) => {
                for (i = 0; i < arr.length; i++) {
                    b = document.createElement("DIV");
                    b.innerText = arr[i]["name_and_artist"]
                    b.addEventListener("click", function(e) {
                        inp.value = this.innerText;
                        closeAllLists();
                        inp.dispatchEvent(new KeyboardEvent( 'keydown' , {'key':'Enter'} ));
                    });
                    a.appendChild(b);
                }
            })
            .catch((e) => {
                console.log(e);
            })
    });
    inp.addEventListener("keydown", function(e) {
        var x = document.getElementById(this.id + "autocomplete-list");
        if (x) x = x.getElementsByTagName("div");
        if (e.keyCode == 40) {
          currentFocus++;
          addActive(x);
        } else if (e.keyCode == 38) { //up
          currentFocus--;
          addActive(x);
        }
    });
    function addActive(x) {
      if (!x) return false;
      removeActive(x);
      if (currentFocus >= x.length) currentFocus = 0;
      if (currentFocus < 0) currentFocus = (x.length - 1);
      x[currentFocus].classList.add("autocomplete-active");
      inp.value = x[currentFocus].innerText;
    }
    function removeActive(x) {
      for (var i = 0; i < x.length; i++) {
        x[i].classList.remove("autocomplete-active");
      }
    }
    function closeAllLists(elmnt) {
      var x = document.getElementsByClassName("autocomplete-items");
      for (var i = 0; i < x.length; i++) {
        if (elmnt != x[i]) {
            x[i].parentNode.removeChild(x[i]);
        }
    }
  }
  document.addEventListener("click", function (e) {
      closeAllLists(e.target);
  });
}
