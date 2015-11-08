/**
 * Created by tos on 07.11.2015.
 */

/*let button = document.getElementById('button');
button.onclick = function(e){
    console.log('button', e);
};*/


let Interface = {
    showSection: function(section) {
        let sections = document.getElementsByClassName('mainSection'),
            activateSection = document.getElementById(section);
        console.log('Sections %o %o', section, sections.length);
        for (let i=0; i<sections.length; i++) {
            sections[i].hidden = true;
        }
        /*sections.map(function (v) {
            v.hidden = true;
        });*/
        activateSection.hidden = false;
    }
};

module.exports = Interface;