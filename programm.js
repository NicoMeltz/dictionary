var listenEinträge = 1;
var vokabelDB;
var removeElement = async (event) => {
    // Removes an element from the document.
    var elementId = parseInt( event.target.parentElement.id);
    var element = document. getElementById(elementId);
    element.parentNode.removeChild(element);
    console.log(await vokabelDB.friends.where("id").equals(elementId).delete());
}


document.addEventListener("DOMContentLoaded", function (event) {
    document.getElementById("b1").onclick = async  () => {
        var le = document.getElementById("t1").value;
        var de = document.getElementById("t2").value;
        listenEinträge++;

        createElement(le, de, listenEinträge);

        await vokabelDB.friends.put({ de: de, le: le, id: listenEinträge });
       

    }

    vokabelDB = new Dexie("friend_database");
    vokabelDB.version(1).stores({
        friends: 'id,le,de'
    });
    vokabelDB.friends.toArray(function (eles) {
        eles.forEach(ele => {
            createElement(ele.le, ele.de, ele.id)
        });

    })
    var input = document.getElementById("suchFeld");

    input.addEventListener("keyup", function(event) {
        // Number 13 is the "Enter" key on the keyboard
        if (event.keyCode === 13) {
          // Cancel the default action, if needed
          event.preventDefault();
          // Trigger the button element with a click
          document.getElementById("suchen").click();
        }
      });

    document.getElementById("suchen").onclick = async () => {
        var suchtext = document.getElementById("suchFeld").value;
        removeAllChilds();
        var erg = await vokabelDB.friends.where('de').startsWithIgnoreCase(suchtext)
                                          .or("le").startsWithIgnoreCase(suchtext)
            .toArray();
        erg.forEach(ele => {
            createElement(ele.le, ele.de, ele.id)
        });
    };

});
 
function createElement (le,de,id) {
    var li = document.createElement("li");
    var valuetext = "Lat.:" + le + " Deutsch :" + de + " " ;
    var text = document.createTextNode(valuetext);
    li.appendChild(text);
    li.id = id;

    var button = document.createElement("button");
    li.appendChild(button);
    button.innerHTML = "X";
    button.onclick = removeElement;
    button.className = "red";

    var list = document.getElementById("ul1"); 
    list.appendChild(li);
}
  
function removeAllChilds() {
    var list = document.getElementById("ul1");
  
    while (list.firstChild) {
        list.removeChild(list.firstChild);
    }
}