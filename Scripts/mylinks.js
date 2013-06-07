var body;
function addHead(){
	body = document.body;

	var title = document.createElement('title');
	var titleText = document.createTextNode('enzosv');
	title.appendChild(titleText);
	body.appendChild(title);
	var home = document.createElement('a');
	var homeText = document.createTextNode('Home ');
	home.appendChild(homeText);
	home.href = '/';
	body.appendChild(home);

	addLink('Pong');
	addLink('Invasion');
	addLink('Escape');
	addLink('Nbody');
	addLink('HundredsClone');
	
	var hellWeek = document.createElement('a');
	var hellWeekText = document.createTextNode('Hell Week by 8bitgames');
	hellWeek.appendChild(hellWeekText);
	hellWeek.href = 'http://hell-week.site44.com/';
	body.appendChild(hellWeek);
}

function addLink(text){
	var a = document.createElement('a');
	var t = document.createTextNode(text + ' ');
	a.appendChild(t);
	a.href = '/'+text.toLowerCase();
	body.appendChild(a);
}