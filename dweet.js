

//JavaScript Document
$(document).ready(function() 
{
	dweetio.get_all_dweets_for("rc2c-jobapplication", function(err, dweets)
	{

		// On recupère l'élément html ou insérer les messages Dweet.
		var conteneurDweetRC2C = document.getElementById('conteneurDweetRC2C');
		
		// Variable qui contiendra la phrase à chiffrer/dechiffrer.
		var phrase = new String('');
		
		/* On créer pour chaque message dweet récupéré un article permettant de l'afficher. */
		var i = 0;
		
	    for(theDweet in dweets)
	    {
	        var dweet = dweets[theDweet];
	        
	        var article = document.createElement('article');
	        
	        /* Header contenant le nom thing, et la date d'envoi. */
	        var header = document.createElement('header');
	        var titre = document.createElement('h1');
	        var texteTitre = document.createTextNode('Dweet de ' + dweet.thing + ' envoyé le ' + dweet.created);
	        titre.appendChild(texteTitre);
	        header.appendChild(titre);
	        article.appendChild(header);
	        
	        /* Message dweet. */
	        var paragraphe = document.createElement('p');
	        var texteParagraphe = document.createTextNode(JSON.stringify(dweet.content));
	        paragraphe.appendChild(texteParagraphe);
	        article.appendChild(paragraphe);
	        
	        conteneurDweetRC2C.appendChild(article);
	        
	        /* N'ayant pas d'élément permettant d'identifier spécifiquement un message à chiffrer/dechiffrer, on sélectionne à la main les messages
	         * composants la phrase à chiffrer/dechiffrer. */
	        if(i == 1 || i == 2)
	        {
	        	phrase = phrase.slice(0, 0) + JSON.stringify(dweet.content.message) + phrase.slice(0);
	        }
	        
	        i++;
	    }
	    
	    phrase = phrase.replace(/"/g, '');
	    /([a-zA-Z]+)/g.exec(phrase);
	    
	    var paragraphePhrase = document.createElement('p');
	    // Appel à la methode de chiffrement/dechiffrement.
	    var texteParagraphePhrase = document.createTextNode(rot13(phrase));
	    paragraphePhrase.appendChild(texteParagraphePhrase);
	    conteneurDweetRC2C.appendChild(paragraphePhrase);

	});
	
	
});

/**
 * Fonction permettant de chiffrer/dechiffrer un message par l'algorythme ROT13.
 * @param phrase
 * @returns {String}
 */
function rot13(phrase)
{
	/* On recherche la première série de caractères latin à chiffrer/dechiffrer. */
	var regex = /([a-zA-Z]+)/g;
	var result = regex.exec(phrase);
	
	/* Si on ne trouve rien, on est au bout de la récursion. */
	if(result == null)
	{
		return '';
	}
	
	var mot = new String(result[0]);
	
	/* On chiffre/dechiffre. 
	 * Après avoir récupéré le code ASCII d'un caractère, on le décale de 13, tout en s'assurant qu'il ne sort pas de se classe de caractère
	 * (majuscule/minuscule, en redécalant de 26). On n'a plus ensuite qu'à remplacer par le nouveau caractère. */
	
	 /* A - Z : 65 - 90
	  * a - z : 97 - 122 */
	for(var i = 0; i < mot.length; i++)
	{
		var code = mot.charCodeAt(i);
		var limite = code >= 97 ? 97 : 65;
		var	code13 = code - 13 < limite ? code - 13 + 26 : code - 13;
		mot = mot.slice(0, i) + String.fromCharCode(code13) + mot.slice(i + 1);
	}
	
	/* On récupère ensuite la série de caractères spéciaux. */
	var regexReste = /([^a-zA-Z]*)/g;
	var resultReste = regexReste.exec(phrase.substring(regex.lastIndex));
	
	var reste = '';
	if(resultReste != null)
	{
		reste = resultReste[0];
	}
	
	/* On retourne le résultat mot chiffré/dechiffré + caractères spéciaux + le retour de l'appel recursif pour chiffrer/dechiffrer le reste de la phrase. */
	return mot + reste + rot13(phrase.substring(regex.lastIndex));
}