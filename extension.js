// This extension was developed by :
// * Baptiste Saleil http://bsaleil.org/
// * Arnaud Bonatti https://github.com/Obsidien
//
// Licence: GPLv2+

const St = imports.gi.St;
const PanelMenu = imports.ui.panelMenu;
const PopupMenu = imports.ui.popupMenu;
const Main = imports.ui.main;
const Lang = imports.lang;
const Clutter = imports.gi.Clutter;
const GLib = imports.gi.GLib;
const Gio = imports.gi.Gio;
const Shell = imports.gi.Shell;
const Util = imports.misc.util;
const Gettext = imports.gettext;

var path;
var workDir = "/home/nagae-memooff/rails/mdyapi/"
var builtInDir = "/home/nagae-memooff/.rvm/rubies/default/";
var gitDir = "/home/nagae-memooff/rails/mdyapi/";
var workDirTo = "/software/tags/my-tags";
var builtInDirTo = "/software/tags/built-in-tags";


// TasksManager function
function TasksManager(metadata) {
	path = metadata.path;
	this.file = resovlePath("menulists");
	this._init();
}

// Prototype
TasksManager.prototype =
	{
	__proto__: PanelMenu.Button.prototype,

	_init: function() 
	{			
		PanelMenu.Button.prototype._init.call(this, St.Align.START);

		this.buttonText = new St.Label({text:"ycp"});
		this.buttonText.set_style("text-align:center");
		this.actor.add_actor(this.buttonText);
		let varFile = this.file;
		let tasksMenu = this.menu;
		let buttonText = this.buttonText;

		// Sync
		if (GLib.file_test(this.file, GLib.FileTest.EXISTS)) {
			let content = Shell.get_file_contents_utf8_sync(this.file);
			let lines = content.toString().split('\n');

			for (let i=0; i<lines.length; i++) {
				// if not a comment && not empty
				if (lines[i][0] != '#' && lines[i] != '' && lines[i] != '\n')
					{
						let item = new PopupMenu.PopupMenuItem(lines[i]);
						item.connect('activate', functionArray[i-1]);
						tasksMenu.addMenuItem(item);
					}
			}
			let item = new PopupMenu.PopupMenuItem("Open extension dir");
			item.connect('activate', openExtensionDir);
			tasksMenu.addMenuItem(item);

		}
		else { 
			global.logError("work extension Error: Error while reading file : " + varFile);
		}
	},


	enable: function() {
		Main.panel._leftBox.insert_child_at_index(this.actor, 1);
		Main.panel._menus.addMenu(this.menu);

		// Refresh menu
		let fileM = Gio.file_new_for_path(this.file);
		this.monitor = fileM.monitor(Gio.FileMonitorFlags.NONE, null);
	},

	disable: function() {
		Main.panel._menus.removeMenu(this.menu);
		Main.panel._leftBox.remove_actor(this.actor);
		this.monitor.cancel();
	}
}

// Init function
function init(metadata) {		
	return new TasksManager(metadata);
}

function resovlePath(file) {
	return path + "/" + file ;
}
var openExtensionDir = function() {
	Util.spawn(["/usr/bin/nautilus",path]);
}

var functionArray = [
	function openWorkDir() {
	cmd = resovlePath('openWorkDir');
	let conn = Util.spawn([cmd,workDir]);
}
	,
function remakeWorkDirTag() {
	cmd = resovlePath('remakeTag');
	let conn = Util.spawn([cmd,workDirTo,workDir,"finished rebuild user tags."]);
//    let conn = Util.spawn(['/usr/bin/ctags','-R','-o',workDirTo,workDir]);
//    Main.notify("work dir tags rebuilding.");
}
	,
function remakeBuiltInTag() {
	cmd = resovlePath('remakeTag');
	let conn = Util.spawn([cmd,builtInDirTo,builtInDir,"finished rebuild built-in tags."]);
//    let conn = Util.spawn(['/usr/bin/ctags','-R','-o',builtInDirTo,builtInDir]);
//    Main.notify("ruby built-in tags rebuilding.");
}
	,
function commitToLocalRepository() {
	cmd = resovlePath('commitToLocalRepository');
	let conn = Util.spawn([cmd,gitDir]);
}
//  ,
//function pushToRemote() {
//  cmd = resovlePath('pushToRemote');
//  let conn = Util.spawn([cmd,gitDir]);
//}
//  ,
//function pullFromRemote() {
//  cmd = resovlePath('pullFromRemote');
//  let conn = Util.spawn([cmd,gitDir]);
//}
]
