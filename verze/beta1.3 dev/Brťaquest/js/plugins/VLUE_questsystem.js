//==
// Quest System MV Version 1.2b
//==

/*:
 * @plugindesc Do you want quests? This gives you quests!!
 * @author Vlue
 *
 * @param Quest Log Details
 * @desc The details for the quest log overlay
 * @default x:490, y:0, width:326, textSize:18
 *
 * @param Quest Log Max
 * @desc Max number of quests to be tracked in the quest log
 * @default 5
 *
 * @param Use Categories
 * @desc Whether or not to categorize quests in the Quest Log
 * @default true
 *
 * @param Quest Categories
 * @desc The many quest categories available (as many as you want)
 * @default "All","Main","Side","Completed","Failed"
 *
 * @param All Quests Category Name
 * @desc The name of the category for all quests (to be used with above)
 * @default All
 *
 * @param Completed Quests Category Name
 * @desc The name of the category for all completed quests (to be used with above)
 * @default Completed
 *
 * @param Failed Quests Category Name
 * @desc The name of the category for all failed quests (to be used with above)
 * @default Failed
 * 
 * @param Quest Accept SE
 * @desc SE to be played when quest is accepted (Set volume to 0 to ignore)
 * @default name:"Book2",volume:100,pitch:100,pan:0
 *
 * @param Quest Fail SE
 * @desc SE to be played when quest is failed (Set volume to 0 to ignore)
 * @default name:"Disappointment",volume:100,pitch:100,pan:0
 *
 * @param Quest Complete SE
 * @desc SE to be played when quest is completed (Set volume to 0 to ignore)
 * @default name:"Applause1",volume:100,pitch:100,pan:0
 *
 * @param Quest Log Name
 * @desc Name of quest log in menu
 * @default Quest Log
 * 
 * @param Quest Log Header
 * @desc Text displayed at the top of the quest log
 * @default Welcome to the Quest Log!
 *
 * @param Objectives Name
 * @desc The term quest objectives are referred to in game
 * @default Objectives
 * 
 * @param Rewards Name
 * @desc The term quest rewards are referred to in game
 * @default Rewards
 *
 * @param Difficulty String
 * @desc The term for quest difficulty
 * @default Difficulty
 *
 * @param Track String
 * @desc The string displayed in the TRACK/untrack/abandon window 
 * @default Track Quest
 * 
 * @param Untrack String
 * @desc The string displayed in the track/UNTRACK/abandon window
 * @default Untrack Quest
 *
 * @param Abandon String
 * @desc The string displayed in the track/untrack/ABANDON window
 * @default Abandon Quest
 *
 * @param Accept String
 * @desc The string displayed when accepting quests (Accept)
 * @default Accept
 * 
 * @param Decline String
 * @desc The string displayed when accepting quests (Decline)
 * @default Decline
 * 
 * @param Complete String
 * @desc The string displayed when completing quests (Turnin)
 * @default Complete
 * 
 * @param Cancel String
 * @desc The string displayed when completing quests (Cancel)
 * @default Cancel
 *
 * @help Quest System MV! v1.2b
 *  Follow me on twitter: https://twitter.com/DaimoniousTails
 *   Or facebook: https://www.facebook.com/DaimoniousTailsGames/
 *   for the most recent updates!
 *  Find all of my work here: http://daimonioustails.weebly.com/
 * 
 *   **NOTE** Objective id's begin at 0, so the first objective id is 0, the 2nd is 1, so on
 *  Plugin Commands:
 *   quest accept #              -Accepts quest with an ID of #
 *   quest askAccept #           -Asks the player to accept quest #
 *   quest abandon #             -Abandons quest #
 *   quest fail #                -Fails quest #
 *   quest turnin #              -Turnins quest # (without prompt)
 *   quest askTurnin #           -Asks the player to turnin quest #
 *   quest advance # # #         -Advanced quest #'s objective number # by #
 *   quest set # # #             -Sets quest #'s objective number # to #
 *   quest max # # #             -Sets quest #'s objective number #'s max value to #
 *   quest hide # #              -Hides quest #'s objective number #
 *   quest show # #              -Shows quest #'s objective number #
 *   quest call #                -Calls the quest log manually (if # supplied, to that quest ID)
 *
 *  Script Calls:
 *   this.questAccepted(questId)  -returns whether the quest is accepted or not
 *   this.questCompleted(questId) -returns whether the quest is completed or not
 *   this.questTurnedIn(questId)  -returns whether the quest is turned in or not
 *   this.obj(questId, objId)     -Returns the current value of Quest questId's objective objId
 *   this.objMax(questId, objId)  -returns the maximum value of QUest questId's objective objId
 *
 *  The joys, oh the joyyysss of creating quests! It uh.. well good luck.
 *  Anyways create a text document named Quests.txt in the data folder of the 
 *  Game Project and set up your quests in there like.. this:
 *
 *  <quest#>
 *   name:Quest Name
 *   level:#
 *   category:categoryName
 *   difficulty:Some Words (Easy, Normal, whatever you want)
 *   autoComplete:true/false
 *   canAbandon:true/false
 *   forceAccept:true/false
 *   forceTurnin:true/false
 *   qgiverName:Random name
 *   location:Random words
 *   <description>
 *  Some words describing the quest
 *  They can be multi-lined!
 *  Careful though... no text wrap (yet)
 *   <description>
 *   <objectives>
 *    {name:"An Objective Name", max:#, hidden:true/false}
 *    {and more as you need (see below for all objective tags)}
 *   <objectives>
 *   gold:#
 *   exp:#
 *   expScale:#     -modifies exp gained by +/-#% times difference between quest level and player level
 *   <rewards>
 *    {type:"item" (or "weapon" or "armor"), id:#, amount:#}
 *    {and more as needed}
 *   <rewards>
 *  <quest#>
 *
 *  Name and Objectives are non-optional.
 *  The ID of the quest will be equal to the number used in <quest#> (Oh but keep them in order.. 
 *   bad things will happen other wise, no 1,2,4,5 : no 10, 563, 2, 5 : yes 1,2,3,4,5,6,7,8)
 *  Actually, they don't even need to be in order, just don't skip any numbers.
 *
 *  Objective Tags:
 *   name:"Objective Name",
 *   max:objectiveMaxValue,
 *   hidden:true or false,
 *   monster:id,
 *   item:[type ("item","armor", or "weapon"), id],
 *
 */
 
 $gameQuests = null;
 
(function() {

	var parameters = PluginManager.parameters('QuestSystem');
	var questLogDetails = eval("( {" + (parameters["Quest Log Details"] || "x:490,y:0,width:326,textSize:18") + "} )");
	var useCategories = (parameters['Use Categories'] || "true").toLowerCase() == "true";
	var questCategories = eval("[" + (parameters["Quest Categories"] || '"All","Main","Side","Completed","Failed"') + "]");
	var defaultCategory = parameters["Default Category"] || "Main";
	var questLogMaxDisplay = Number(parameters["Quest Log Max"] || 5);
	var questAcceptSE = eval("( {" + (parameters["Quest Accept SE"] || 'name:"Book2",volume:100,pitch:100,pan:0') + "} )");
	var questFailSE = eval("( {" + (parameters["Quest Fail SE"] || 'name:"Disappointment",volume:100,pitch:100,pan:0') + "} )");
	var questCompleteSE = eval("( {" + (parameters["Quest Complete SE"] || 'name:"Applause1",volume:100,pitch:100,pan:0') + "} )");
	var questLogName = parameters["Quest Log Name"] || "Quest Log";
	var questLogHeader = parameters["Quest Log Header"] || "Welcome to the Quest Log!"
	var questObjectiveName = parameters["Objectives Name"] || "Objectives"
	var questRewardsName = parameters["Rewards Name"] || "Rewards"
	var questDifficultyName = parameters["Difficulty String"] || "Difficulty: "
	var questCategoryAll = parameters["All Quests Category Name"] || "All"
	var questCategoryComplete = parameters["Completed Quests Category Name"] || "Completed"
	var questCategoryFail = parameters["Failed Quests Category Name"] || "Failed"
	var questTrackName = parameters["Track String"] || "Track Quest"
	var questUntrackName = parameters["Untrack String"] || "Untrack Quest"
	var questAbandonName = parameters["Abandon String"] || "Abandon Quest"
	var questCommandAccept = parameters["Accept String"] || "Accept"
	var questCommandDecline = parameters["Decline String"] || "Decline"
	var questCommandComplete = parameters["Complete String"] || "Complete"
	var questCommandCancel = parameters["Cancel String"] || "Cancel"
	var questLogEntry = 0;
	
	TextManager.getErrorDetails = function() {
		if($gameMap) {
			return "[Map: " + $gameMap._mapId + "] [Event: " + $gameMap._interpreter._eventId + "] : \n"
		}
	}
	
	DataManager.loadQuestFile = function() {
		var xml = new XMLHttpRequest();
		var url = "data/Quests.txt";
		xml.onload = function() {
			if(xml.status < 400) {
				DataManager.createQuests(xml.responseText);
			}
		}
		xml.open("GET",url,true);
		xml.send();
	};
	var quests_DataManager_creategameobjects = DataManager.createGameObjects;
	DataManager.createGameObjects = function() {
		quests_DataManager_creategameobjects.call(this);
		this.loadQuestFile();
	};
	DataManager.createQuests = function(questData) {
		$gameQuests = new Game_Quests(questData);
	}
	
	
	function Game_Quests() {
		this.initialize.apply(this, arguments);
	}
	Game_Quests.prototype.initialize = function(questData) {
		this.createQuests(questData);
		this.resetObjectives();
	}
	Game_Quests.prototype.createQuests = function(questData) {
		this._quests = [0];
		if(questData) {
			var numberOfQuests = questData.match(/<quest(\d+)>/g).length / 2
			for(var i = 1;i <= numberOfQuests;i++) {
				var questString = questData.match(new RegExp("<quest" + i + ">([^]+)<quest" + i + ">"));
				if(questString) {
					this._quests.push(new Quest(i, this.createQuestStruct(i, questString[1])));
				} else {
					throw new Error("Quest List: Could not get data for quest ID# " + i + ". Check your setup.");
				}
			}
		}
	}
	Game_Quests.prototype.createQuestStruct = function(id, questString) {
		var questHash = {}
		if(questString.match(/<objectives>/g).length > 2) {
			throw new Error("Quest List: Possible repeated quest ID. (ID #" + id + ")");
		}
		questHash.name = questString.match(/name:(.+)/);
		questHash.level = questString.match(/level:(.+)/);
		questHash.category = questString.match(/category:(.+)/);
		questHash.difficulty = questString.match(/difficulty:(.+)/);
		questHash.autoComplete = questString.match(/autoComplete:(.+)/);
		questHash.canAbandon = questString.match(/canAbandon:(.+)/);
		questHash.forceAccept = questString.match(/forceAccept:(.+)/);
		questHash.forceTurnin = questString.match(/forceTurnin:(.+)/);
		questHash.qgiverName = questString.match(/qgiverName:(.+)/);
		questHash.location = questString.match(/location:(.+)/);
		questHash.description = questString.match(/<description>([^]+)<description>/);
		var objData = questString.match(/<objectives>([^]+)<objectives>/);
		if(objData) {
			objData = eval( "[" + objData[1].split("}").join("},") + "]" );
		} else {
			throw new Error("Quest List: Quest ID# " + id + " does not have a proper objective setup.")
		}
		questHash.objectives = objData;
		questHash.gold = questString.match(/gold:(.+)/);
		questHash.exp = questString.match(/exp:(.+)/);
		questHash.expScale = questString.match(/expScale:(.+)/);
		var rewardData = questString.match(/<rewards>([^]+)<rewards>/);
		if(rewardData) { rewardData = eval( "[" + rewardData[1].split("}").join("},") + "]" ); }
		questHash.rewards = rewardData;
		return questHash;
	}
	Game_Quests.prototype.update = function() {
		if(!$gameParty) { return; }
		for(var i = 0;i < this._quests.length;i++) {
			quest = this._quests[i];
			if(quest && quest.active()) {
				for(var j = 0;j < quest._objectives.length;j++) {
					obj = quest._objectives[j];
					if(obj._item) {
						container = $gameParty.getContainer(obj._item[0]);
						item = container[obj._item[1]];
						if(obj.current() != $gameParty.numItems(item)) {
							quest.setObj(j,$gameParty.numItems(item));
						}
					}
				}
			}
		}
	}
	Game_Quests.prototype.monsterDeath = function(enemyId) {
		for(var i = 0;i < this._quests.length;i++) {
			quest = this._quests[i];
			if(quest && quest.active()) {
				for(var j = 0;j < quest._objectives.length;j++) {
					obj = quest._objectives[j];
					if(obj._monster && obj._monster == enemyId) {
						quest.advObj(j,1);
					}
				}
			}
		}
	}
	Game_Quests.prototype.resetObjectives = function() {
		this._resetHash = {}
		this._resetHash[0] = 0;
		for(var i = 1;i < this._quests.length;i++) {
			var id = this._quests[i]._id;
			this._resetHash[id] = {}
			this._resetHash[id].accepted = false;
			this._resetHash[id].turnedIn = false;
			this._resetHash[id].failed = false;
			for(var j = 0;j < this._quests[i]._objectives.length;j++) {
				var obj = this._quests[i]._objectives[j];
				this._resetHash[id][j] = [0,obj._hidden,obj._max];
			}
		}
	}
	Game_Quests.prototype.getQuest = function(questId) {
		if(typeof questId == "string") {
			for(var i = 0;i < this._quests.length;i++) {
				if(this._quests[i].name == questId) { return this._quests[i]; }
			}
		} else {
			if(this._quests[questId]) {return this._quests[questId];}
		}
		throw new Error(TextManager.getErrorDetails() + "No quest with id of " + questId + " found.");
	}
	Game_Quests.prototype.anyQuests = function() {
		for(var i = 1;i < this._quests.length;i++) {
			var quest = this._quests[i];
			if(quest.accepted() && !quest.turnedIn()) { return false; }
		}
		return true;
	}
	Game_Quests.prototype.tracking = function() { return $gameParty._tracking; }
	Game_Quests.prototype.trackQuest = function(questId) {
		var tracking = this.tracking();
		if(tracking.indexOf(questId) >= 0) { return; }
		tracking.push(questId);
		if(tracking.length > questLogMaxDisplay) {
			tracking.splice(0,1);
		}
	}
	Game_Quests.prototype.untrackQuest = function(questId) {
		var tracking = this.tracking();
		if(tracking.indexOf(questId) >= 0) {
			tracking.splice(tracking.indexOf(questId), 1);
		}
	}
	
	Game_Enemy.prototype.onBattleEnd = function() {
		if($gameQuests && this.isDead()) { $gameQuests.monsterDeath(this._enemyId); }
	}
	
	function Quest() {
		this.initialize.apply(this, arguments);
	}
	Quest.prototype.initialize = function(id, questHash) {
		this._id = id;
		this._category = questHash.category ? questHash.category[1] : defaultCategory;
		this._level = questHash.level ? Number(questHash.level[1]) : 1;
		this._difficulty = questHash.difficulty ? questHash.difficulty[1] : "";
		this._name = questHash.name ? questHash.name[1] : "No Quest Name Defined";
		this._description = questHash.description ? questHash.description[1] : "";
		this._qgiverName = questHash.qgiverName ? questHash.qgiverName[1] : "";
		this._location = questHash.location ? questHash.location[1] : "";
		this._autoComplete = questHash.autoComplete ? questHash.autoComplete[1] == "true" : false;
		this._canAbandon = questHash.canAbandon ? questHash.canAbandon[1] == "true" : false;
		this._forceTurnin = questHash.forceTurnin ? questHash.forceTurnin[1] == "true" : false;
		this._forceAccept = questHash.forceAccept ? questHash.forceAccept[1] == "true" : false;
		this._needPopup = false;
		this._objectives = [];
		for(var i = 0;i < questHash.objectives.length;i++) {
			this._objectives.push(new Objective(i, this._id, questHash.objectives[i]));
		}
		this._gold = questHash.gold ? Number(questHash.gold[1]) : 0;
		this._exp = questHash.exp ? Number(questHash.exp[1]) : 0;
		this._expScale = questHash.expScale ? Number(questHash.expScale[1]) : 0;
		this._rewards = questHash.rewards || [];
	}
	Quest.prototype.accept = function() {
		this.reset();
		$gameParty.quests[this._id].accepted = true;
		$gameParty.quests[this._id].failed = false;
		this.trackQuest();
		$gameMap._needsRefresh = true;
		AudioManager.playSe(questAcceptSE);
	}
	Quest.prototype.abandon = function() {
		this.reset();
		$gameParty.quests[this._id].accepted = false;
	}
	Quest.prototype.failed = function() {
		return $gameParty.quests[this._id].failed;
	}
	Quest.prototype.fail = function() {
		AudioManager.playSe(questFailSE);
		$gameParty.quests[this._id].failed = true;
		this.abandon();
	}
	Quest.prototype.accepted = function() { return $gameParty.quests[this._id].accepted; }
	Quest.prototype.completed = function() {
		for(var i = 0;i < this._objectives.length;i++) {
			if(!this._objectives[i].completed()) { return false; }
		}
		return true;
	}
	Quest.prototype.forceDone = function() {
		$gameParty.quests[this._id].accepted = true;
		for(var i = 1; 1 < this._objectives.length;i++) {
			this._objectives[i].forceComplete();
		}
		this.turnIn();
	}
	Quest.prototype.reset = function() {
		$gameParty.quests[this._id].accepted = false;
		for(var i = 0; i < this._objectives.length;i++) {
			$gameParty.quests[this._id][i] = [0,this._objectives[i]._hidden,this._objectives[i]._max];
		}
		$gameParty.quests[this._id].turnedIn = false;
	}
	Quest.prototype.objective = function(id) {
		if(id >= this._objectives.length) {
			throw new Error(TextManager.getErrorDetails() + "No objective with id of " + id + " found for quest " + this._id + ".");
		}
		return this._objectives[id];
	}
	Quest.prototype.setObj = function(id, value) {
		this.objective(id).setValue(value);
		if(!this.completed()) { this._needPopup = false; }
		if(this.completed()) {
			if(!this._needPopup) { this.popUp(); }
			if(this._autoComplete) { this.turnIn(); }
		}
		$gameMap._needsRefresh = true;
	}
	Quest.prototype.advObj = function(id, value) {
		this.setObj(id, this.objective(id).current() + value);
	}
	Quest.prototype.turnIn = function() {
		$gameParty.quests[this._id].turnedIn = true;
		this.untrackQuest();
		$gameMap._needsRefresh = true;
		$gameParty.gainGold(this._gold);
		for(var i = 0;i < $gameParty.members().length;i++) {
			$gameParty.members()[i].gainExp(this.getRewardExp());
		}
		this._rewards
		for(var i = 0;i < this._rewards.length;i++) {
			var item = $gameParty.getContainer(this._rewards[i].type)[this._rewards[i].id]
			$gameParty.gainItem(item, this._rewards[i].amount);
		}
		AudioManager.playSe(questCompleteSE);
	}
	Quest.prototype.trackQuest = function() {
		$gameQuests.trackQuest(this._id);
	}
	Quest.prototype.untrackQuest = function() {
		$gameQuests.untrackQuest(this._id);
	}
	Quest.prototype.popUp = function() {
		//Not Implemented
	}
	Quest.prototype.turnedIn = function() {
		return $gameParty.quests[this._id].turnedIn;
	}
	Quest.prototype.active = function() {
		return this.accepted() && !this.completed();
	}
	Quest.prototype.getRewardExp = function() {
		var pval = this._expScale * (this._level - $gameParty.highestLevel()) / 100 + 1;
		return this._exp * pval;
	}
	
	function Objective() {
		this.initialize.apply(this, arguments);
	}
	Objective.prototype.initialize = function(id, questId, obj) {
		this.id = id;
		this.questId = questId;
		this.name = obj.name;
		this._max = obj.max;
		this._hidden = obj.hidden;
		this._monster = obj.monster;
		this._item = obj.item;
	}
	Objective.prototype.completed = function() {
		return this.current() >= this.max();
	}
	Objective.prototype.forceComplete = function() {
		$gameParty.quests[this.questId][this.id][0] = this.max();
	}
	Objective.prototype.current = function() {
		return $gameParty.quests[this.questId][this.id][0];
	}
	Objective.prototype.setValue = function(value) {
		$gameParty.quests[this.questId][this.id][0] = value;
	}
	Objective.prototype.hidden = function() {
		return $gameParty.quests[this.questId][this.id][1];
	}
	Objective.prototype.max = function() {
		console.log($gameParty.quests[this.questId][this.id][2]);
		return $gameParty.quests[this.questId][this.id][2];
	}
	
	
	function Scene_Quests() {
		this.initialize.apply(this, arguments);
	}
	Scene_Quests.prototype = Object.create(Scene_MenuBase.prototype);
	Scene_Quests.prototype.constructor = Scene_Quests;
	Scene_Quests.prototype.initialize = function() {
		Scene_MenuBase.prototype.initialize.call(this);
	};
	Scene_Quests.prototype.create = function() {
		Scene_MenuBase.prototype.create.call(this);
		this._helpWindow = new Window_Help(1);
		this._helpWindow.setText(questLogHeader);
		this._listWindow = new Window_SceneList();
		this._listWindow.setHandler("cancel",this.listCancel.bind(this));
		this._listWindow.setHandler("ok",this.listOk.bind(this));
		this._listWindow.refresh;
		this._listWindow.activate();
		this._listWindow.preSelect();
		this._commandWindow = new Window_QuestTrack();
		this._commandWindow.x = (Graphics.width - this._commandWindow.width) / 2;
		this._commandWindow.y = (Graphics.height - this._commandWindow.height) / 2;
		this._detailWindow = new Window_SceneDetail();
		this._commandWindow.setHandler("track",this.track.bind(this));
		this._commandWindow.setHandler("untrack",this.untrack.bind(this));
		this._commandWindow.setHandler("abandon",this.abandon.bind(this));
		this._commandWindow.setHandler("cancel",this.commandCancel.bind(this));
		this.addWindow(this._helpWindow);
		this.addWindow(this._listWindow);
		this.addWindow(this._detailWindow);
		this.addWindow(this._commandWindow);
		if(useCategories) { 
			this._categoryWindow = new Window_QuestCategory();
			this._categoryWindow.setHandler("cancel",this.categoryCancel.bind(this));
			this._categoryWindow.setHandler("ok",this.categoryOk.bind(this));
			this.addWindow(this._categoryWindow);
			this._listWindow.deactivate();
		}
	}
	Scene_Quests.prototype.update = function() {
		Scene_MenuBase.prototype.update.call(this);
		this._detailWindow.quest(this._listWindow.active ? this._listWindow.currentItem() : null);
		if(useCategories) { this._listWindow.setCategory(this._categoryWindow.category()); }
	}
	Scene_Quests.prototype.categoryCancel = function() {
		this.popScene();
	}
	Scene_Quests.prototype.categoryOk = function() {
		this._listWindow.select(0);
		this._listWindow.activate();
	}
	Scene_Quests.prototype.listCancel = function() {
		if(useCategories) {
			this._categoryWindow.activate();
			this._detailWindow.quest(null);
		} else { 
			this.popScene();
		}
	}
	Scene_Quests.prototype.listOk = function() {
		this._commandWindow.quest(this._listWindow.currentItem());
		this._commandWindow.refresh();
		this._commandWindow.select(0);
		this._commandWindow.activate();
		this._commandWindow.open();
	}
	Scene_Quests.prototype.track = function() {
		$gameQuests.trackQuest(this._listWindow.currentItem()._id);
		this.commandCancel();
	}
	Scene_Quests.prototype.untrack = function() {
		$gameQuests.untrackQuest(this._listWindow.currentItem()._id);
		this.commandCancel();
	}
	Scene_Quests.prototype.abandon = function() {
		this._listWindow.currentItem().abandon();
		this.commandCancel();
	}
	Scene_Quests.prototype.commandCancel = function() {
		this._commandWindow.close();
		this._listWindow.refresh();
		this._listWindow.activate();
		if($gameQuests.anyQuests()) { this.listCancel(); }
	}
	
	Window_Base.prototype.numberLines = function(text) {
		var number = text.match(/\n/g);
		return number ? number.length : 1;
	}
	
	function Window_SceneList() {
		this.initialize.apply(this, arguments);
	}
	Window_SceneList.prototype = Object.create(Window_Selectable.prototype);
	Window_SceneList.prototype.constructor = Window_SceneList;
	Window_SceneList.prototype.initialize = function(x, y, width, height) {
		var height = this.fittingHeight(1) * (useCategories ? 2 : 1);
		Window_Selectable.prototype.initialize.call(this, 0, height, Graphics.width/5*2,Graphics.height - height);
		this._category = questCategoryAll;
		this.refresh();
	};
	Window_SceneList.prototype.makeItemList = function() {
		this._data = [];
		for(var i = 1;i < $gameQuests._quests.length;i++) {
			var quest = $gameQuests._quests[i];
			if(this._category == questCategoryAll) {			
				if(quest.accepted() && !quest.turnedIn()) {
					this._data.push(quest);
				}
			} else if(this._category == questCategoryComplete) {
				if(quest.turnedIn()) { this._data.push(quest); }
			} else if(this._category == questCategoryFail) {
				if(quest.failed()) { this._data.push(quest); }
			} else {
				if(quest.accepted() && !quest.turnedIn() && quest._category == this._category) {
					this._data.push(quest);
				}
			}
		}
		if(this._data.length == 0) { this._data.push(null); }
	}
	Window_SceneList.prototype.preSelect = function() {
		this.select(0);
		if(questLogEntry > 0) {
			for(var i = 0; i < this._data.length;i++) {
				if(this._data[i]._id == questLogEntry) { this.select(i); }
			}
		}
	}
	Window_SceneList.prototype.setCategory = function(category) {
		if(this._category != category) {
			this._category = category;
			this.refresh();
		}
	}
	Window_SceneList.prototype.drawItem = function(index) {
		var item = this._data[index];
		if(item) {
			var rect = this.itemRect(index);
			rect.width -= 4;
			var text = item._name;
			if($gameQuests.tracking().indexOf(item._id) >= 0) {
				text = "*" + text;
			} 
			this.drawText(text,rect.x,rect.y,rect.width);
			if(item.level > 0) { this.drawText(TextManager.levelA + ": " + String(item._level),rect.x,rect.y,rect.width,"right"); }
		}
	}
	Window_SceneList.prototype.currentItem = function() { return this._data[this.index()]; }
	Window_SceneList.prototype.isCurrentItemEnabled = function() { return this.currentItem() != null ? true : false; }
	Window_SceneList.prototype.isOkEnabled = function() { return this._category != questCategoryComplete; }
	Window_SceneList.prototype.refresh = function() { 
		this.makeItemList();
		this.createContents();
		this.drawAllItems();
	}
	Window_SceneList.prototype.maxItems = function() { return this._data ? this._data.length : 0; }
	
	function Window_QuestCategory() {
		this.initialize.apply(this, arguments);
	}
	Window_QuestCategory.prototype = Object.create(Window_HorzCommand.prototype);
	Window_QuestCategory.prototype.constructor = Window_QuestCategory;
	Window_QuestCategory.prototype.initialize = function() {
		Window_HorzCommand.prototype.initialize.call(this, 0, this.fittingHeight(1));
	}
	Window_QuestCategory.prototype.windowWidth = function() { return Graphics.width; }
	Window_QuestCategory.prototype.windowHeight = function() { return this.fittingHeight(1); }
	Window_QuestCategory.prototype.makeCommandList = function() {
		for(var i = 0;i < questCategories.length;i++) {
			this.addCommand(questCategories[i],questCategories[i]);
		}
	}
	Window_QuestCategory.prototype.itemWidth = function() {return this.width / 5;}
	Window_QuestCategory.prototype.category = function() { return this.commandName(this.index()); }
		
	function Window_SceneDetail() {
		this.initialize.apply(this, arguments);
	}
	Window_SceneDetail.prototype = Object.create(Window_Base.prototype);
	Window_SceneDetail.prototype.constructor = Window_SceneDetail;
	Window_SceneDetail.prototype.initialize = function(x, y, width, height) {
		var height = (this.fittingHeight(1) + 12) * (useCategories ? 2 : 1);
		Window_Base.prototype.initialize.call(this, 
		  Graphics.width/5*2, height, Graphics.width - Graphics.width/5*2,
		  Graphics.height - height);
	}
	Window_SceneDetail.prototype.quest = function(quest) {
		if(this._quest == quest) { return; }
		this._quest = quest;
		this.refresh();
	}
	Window_SceneDetail.prototype.lineHeight = function() { return 24; }
	Window_SceneDetail.prototype.isScrollWindow = function() { return true; }
	Window_SceneDetail.prototype.contentsHeight = function() {
		var height = 24;
		if(this._quest) {
			height += this.lineHeight() * 9;
			if(this._quest.getRewardExp() > 0) { height += this.lineHeight(); }
			height += this.lineHeight() * (this.numberLines(this._quest._description) + 1);
			height += this.lineHeight() * this._quest._objectives.length;
			height += 36 * this._quest._rewards.length;
		}
		return height;
	}
	Window_SceneDetail.prototype.refresh = function() {
		this.contents.clear()
		if(this._quest) {
			this.createContents();
			this.contents.fontSize = 18;
			this.changeTextColor(this.systemColor());
			var yy = 0;
			if(this._quest._qgiverName != "") {
				this.drawText(this._quest._qgiverName,0,0,this.contents.width/2);
			}
			if(this._quest._location != "") {
				this.drawText(this._quest._location,this.contents.width/2,0,this.contents.width/2,'right');
				
			}
			yy += this.lineHeight();
			this.changeTextColor(this.crisisColor());
			if(this._quest._level > 0) {
				this.drawText(TextManager.levelA + ": " + String(this._quest._level),0,yy,this.contents.width);
			}
			this.drawText(this._quest._name,0,yy,this.contents.width,'center');
			if(this._quest._difficulty != "") {
				this.drawText(this._quest._difficulty,0,yy,this.contents.width,'right');
			}
			yy += this.lineHeight();
			this.drawTextEx(this._quest._description,0,yy);
			yy += this.lineHeight() * (this.numberLines(this._quest._description) + 1);
			this.changeTextColor(this.systemColor());
			yy += this.lineHeight();
			this.drawText(questObjectiveName,0,yy,this.contents.width);
			this.changeTextColor(this.normalColor());
			yy += this.lineHeight();
			for(var i = 0;i < this._quest._objectives.length;i++) {
				var objective = this._quest.objective(i);
				if(objective.hidden()) { continue; }
				this.drawObjective(yy,objective);
				yy += this.lineHeight();
			}
			this.changeTextColor(this.systemColor());
			yy += this.lineHeight();
			this.drawText(questRewardsName,0,yy,this.contents.width);
			yy += this.lineHeight();
			if(this._quest.getRewardExp() > 0) {
				this.drawText(TextManager.expA + ": ",6,yy,this.contents.width/2);
				this.changeTextColor(this.normalColor());
				this.drawText(this._quest.getRewardExp(),48,yy,this.contents.width/2);
				yy += this.lineHeight();
			}
			if(this._quest._gold > 0) {
				this.changeTextColor(this.normalColor());
				this.drawText(this._quest._gold,6,yy,this.contents.width/2);
				var cx = this.textWidth(this._quest._gold);
				this.changeTextColor(this.systemColor());
				this.drawText(TextManager.currencyUnit,8+cx,yy,this.contents.width/2);
			}
			yy += this.lineHeight();
			this.changeTextColor(this.normalColor());
			for(var i = 0;i < this._quest._rewards.length;i++) {
				var item = $gameParty.getContainer(this._quest._rewards[i].type)[this._quest._rewards[i].id];
				this.drawItemName(item, 6, yy);
				if(this._quest._rewards[i].amount > 1) {
					this.drawText("x"+this._quest._rewards[i].amount,6+this.textWidth(item.name)+42,yy,48);
				}
				yy += 36;
			}
		}
	}
	Window_SceneDetail.prototype.drawObjective = function(yy, obj) {
		this.drawText(obj.name,6,yy,this.contents.width);
		this.drawText(obj.current() + "/" + obj.max(),0,yy,this.contents.width,"right");
	}
	Window_SceneDetail.prototype.resetFontSettings = function() {
		this.contents.fontFace = this.standardFontFace();
		this.resetTextColor();
	};
	
	function Window_QuestTrack() {
		this.initialize.apply(this, arguments);
	}
	Window_QuestTrack.prototype = Object.create(Window_Command.prototype);
	Window_QuestTrack.prototype.constructor = Window_QuestTrack;
	Window_QuestTrack.prototype.initialize = function() {
		Window_Command.prototype.initialize.call(this, 0,0);
		this.openness = 0;
	}
	Window_QuestTrack.prototype.quest = function(quest) {
		this._quest = quest;
	}
	Window_QuestTrack.prototype.makeCommandList = function() {
		if(this._quest) {
			if($gameQuests.tracking().indexOf(this._quest._id) >= 0) {
				this.addCommand(questUntrackName, 'untrack');
			} else {
				this.addCommand(questTrackName, 'track');
			}
			this.addCommand(questAbandonName, 'abandon', this._quest._canAbandon);
		}
	}
	Window_QuestTrack.prototype.windowHeight = function() {
		return this.fittingHeight(2);
	}
	
	var quest_window_menucommand_addoriginalcommands = Window_MenuCommand.prototype.addOriginalCommands;
	Window_MenuCommand.prototype.addOriginalCommands = function() {
		quest_window_menucommand_addoriginalcommands.call(this);
		this.addCommand(questLogName, 'quest');
	}
		
	var quest_scene_menu_createcommandwindow = Scene_Menu.prototype.createCommandWindow;
	Scene_Menu.prototype.createCommandWindow = function() {
		quest_scene_menu_createcommandwindow.call(this);
		this._commandWindow.setHandler('quest', this.sceneQuest.bind(this));
	};
	Scene_Menu.prototype.sceneQuest = function() {
		SceneManager.push(Scene_Quests);
	}
	
	var quest_scene_map_create = Scene_Map.prototype.createAllWindows;
	var quest_scene_map_update = Scene_Map.prototype.update;
	var quest_scene_map_ismenuok = Scene_Map.prototype.isMenuEnabled;
	Scene_Map.prototype.createAllWindows = function() {
		this._questLog = new Window_QuestLog();
		this._questConfirm = new Window_QuestConfirm();
		this._questConfirm.setHandler('accept', this.confirmAccept.bind(this));
		this._questConfirm.setHandler('decline', this.confirmCancel.bind(this));
		this._questConfirm.setHandler('cancel', this.confirmCancel.bind(this));
		this._questTurnin = new Window_QuestTurnin();
		this._questTurnin.setHandler('accept', this.turninAccept.bind(this));
		this._questTurnin.setHandler('decline', this.confirmCancel.bind(this));
		this._questTurnin.setHandler('cancel', this.confirmCancel.bind(this));
		this._questApply = new Window_QuestApply(this._questConfirm,this._questTurnin);
		this.addWindow(this._questLog);
		this.addWindow(this._questConfirm);
		this.addWindow(this._questTurnin);
		this.addWindow(this._questApply);
		quest_scene_map_create.call(this);
	}
	Scene_Map.prototype.showQuest = function(id, turnin) {
		this._questApply.show($gameQuests.getQuest(id),turnin || false);
	}
	Scene_Map.prototype.accepting = function() {
		return this._questConfirm.active || this._questTurnin.active;
	}
	Scene_Map.prototype.confirmAccept = function() {
		this._questApply.accept();
		this._questApply.hide();
	}
	Scene_Map.prototype.confirmCancel = function() {
		this._questApply.hide();
	}
	Scene_Map.prototype.turninAccept = function() {
		this._questApply.turnin();
		this._questApply.hide();
	}
	Scene_Map.prototype.isMenuEnabled = function() {
		return quest_scene_map_ismenuok.call(this) && !this.accepting();
	};
	Scene_Map.prototype.update = function() {
		quest_scene_map_update.call(this);
		if($gameQuests) { $gameQuests.update(); }
	}

	Scene_Base.prototype.accepting = function() { return false; }
	
	function Window_QuestLog() {
		this.initialize.apply(this, arguments);
	}
	Window_QuestLog.prototype = Object.create(Window_Base.prototype);
	Window_QuestLog.prototype.constructor = Window_QuestLog;
	Window_QuestLog.prototype.initialize = function() {
		Window_Base.prototype.initialize.call(this, questLogDetails.x,questLogDetails.y,questLogDetails.width,Graphics.height);
		this.opacity = 0
		this.contents.fontSize = questLogDetails.textSize;
	}
	Window_QuestLog.prototype.update = function() {
		Window_Base.prototype.update.call(this);
		if(Graphics.frameCount % 20 == 0) {
			this.visible = $gameQuests.anyQuests();
			this.visible = $gameQuests.tracking().length > 0;
			if(this.visible) {
				this.contents.clear();
				this.changeTextColor(this.crisisColor());
				this.drawText(questLogName,0,0,this.contents.width,'center');
				var yy = 24;
				for(var i = 0;i < $gameQuests.tracking().length;i++) {
					var quest = $gameQuests._quests[$gameQuests.tracking()[i]];
					if(quest.accepted() && !quest.turnedIn()) {
						this.changeTextColor(this.systemColor());
						this.drawText(quest._name,0,yy,this.contents.width - 6);
						this.changeTextColor(this.normalColor());
						yy += 24;
						for(var j = 0;j < quest._objectives.length;j++) {
							var objective = quest.objective(j);
							if(objective.hidden()) { continue; }
							this.changePaintOpacity(!objective.completed());
							this.drawObjective(yy,objective);
							yy += 24;
						}
						this.changePaintOpacity(true);
					}
				}
			}
		}
	}
	Window_QuestLog.prototype.drawObjective = function(yy, obj) {
		this.drawText(obj.name,6,yy,this.contents.width-24);
		this.drawText(obj.current() + "/" + obj.max(),0,yy,this.contents.width,'right');
	}
	
	//
	
	var vlue_base_window_Window_Base_update = Window_Base.prototype.update;
	Window_Base.prototype.update = function() {
		vlue_base_window_Window_Base_update.call(this);
		if(this.isScrollWindow()) {
			this.processCursorScroll();
			this.processWheelScroll();
			this.clampAndCheck();
		}
	}
	Window_Base.prototype.originHeight = function() {
		return Math.max(0,this.contents.height - this.height - this.standardPadding());
	}
	Window_Base.prototype.processCursorScroll = function() {
		if(Input.isPressed('down')) {
			this.origin.y += 3;
		}
		if(Input.isPressed('up')) {
			this.origin.y -= 3;
		}
		if(Input.isTriggered('pagedown')) {
			this.origin.y += this.lineHeight() * 5;
		}
		if(Input.isTriggered('pageup')) {
			this.origin.y -= this.lineHeight() * 5;
		}
	}
	Window_Base.prototype.clampAndCheck = function() {
		this.origin.y = this.origin.y.clamp(0,this.originHeight())
		this.downArrowVisible = this.origin.y == this.originHeight() ? 0 : 255;
		this.upArrowVisible = this.origin.y == 0 ? 0 : 255;
	}
	Window_Base.prototype.processWheelScroll = function() {
		var threshold = 20;
        if (TouchInput.wheelY >= threshold) {
            this.origin.y += this.lineHeight() * 5;
        }
        if (TouchInput.wheelY <= -threshold) {
            this.origin.y -= this.lineHeight() * 5;
        }
	}
	Window_Base.prototype.isScrollWindow = function() {
		return false;
	}
	//
	
	function Window_QuestApply() {
		this.initialize.apply(this, arguments);
	}
	Window_QuestApply.prototype = Object.create(Window_Base.prototype);
	Window_QuestApply.prototype.constructor = Window_QuestApply;
	Window_QuestApply.prototype.initialize = function(conwin, turnwin) {
		Window_Base.prototype.initialize.call(this, Graphics.width/8,Graphics.width/8,Graphics.width/5*3,
			Graphics.height - Graphics.width/8*2);
		this.openness = 0
		this._confirmWindow = conwin;
		this._turninWindow = turnwin;
	}
	Window_QuestApply.prototype.lineHeight = function() { return 24; }
	Window_QuestApply.prototype.isScrollWindow = function() { return true; }
	Window_QuestApply.prototype.contentsHeight = function() {
		var height = 24;
		if(this._quest) {
			height += this.lineHeight() * 9;
			if(this._quest.getRewardExp() > 0) { height += this.lineHeight(); }
			height += this.lineHeight() * (this.numberLines(this._quest._description) + 1);
			height += this.lineHeight() * this._quest._objectives.length;
			height += 36 * this._quest._rewards.length;
		}
		return height;
	}
	Window_QuestApply.prototype.refresh = function() {
		if(this._quest) {
			this.createContents();
			this.contents.fontSize = 18;
			this.changeTextColor(this.systemColor());
			var yy = 0;
			if(this._quest._qgiverName != "") {
				this.drawText(this._quest._qgiverName,0,0,this.contents.width/2);
			}
			if(this._quest._location != "") {
				this.drawText(this._quest._location,this.contents.width/2,0,this.contents.width/2,'right');
				
			}
			yy += this.lineHeight();
			this.changeTextColor(this.crisisColor());
			if(this._quest._level > 0) {
				this.drawText(TextManager.levelA + ": " + String(this._quest._level),0,yy,this.contents.width);
			}
			this.drawText(this._quest._name,0,yy,this.contents.width,'center');
			if(this._quest._difficulty != "") {
				this.drawText(this._quest._difficulty,0,yy,this.contents.width,'right');
			}
			yy += this.lineHeight();
			this.drawTextEx(this._quest._description,0,yy);
			yy += this.lineHeight() * (this.numberLines(this._quest._description) + 1);
			this.changeTextColor(this.systemColor());
			yy += this.lineHeight();
			this.drawText(questObjectiveName,0,yy,this.contents.width);
			this.changeTextColor(this.normalColor());
			yy += this.lineHeight();
			for(var i = 0;i < this._quest._objectives.length;i++) {
				var objective = this._quest.objective(i);
				if(objective.hidden()) { continue; }
				this.drawObjective(yy,objective);
				yy += this.lineHeight();
			}
			this.changeTextColor(this.systemColor());
			yy += this.lineHeight();
			this.drawText(questRewardsName,0,yy,this.contents.width);
			yy += this.lineHeight();
			if(this._quest.getRewardExp() > 0) {
				this.drawText(TextManager.expA + ": ",6,yy,this.contents.width/2);
				this.changeTextColor(this.normalColor());
				this.drawText(this._quest.getRewardExp(),48,yy,this.contents.width/2);
				yy += this.lineHeight();
			}
			if(this._quest._gold > 0) {
				this.changeTextColor(this.normalColor());
				this.drawText(this._quest._gold,6,yy,this.contents.width/2);
				var cx = this.textWidth(this._quest._gold);
				this.changeTextColor(this.systemColor());
				this.drawText(TextManager.currencyUnit,8+cx,yy,this.contents.width/2);
			}
			yy += this.lineHeight();
			this.changeTextColor(this.normalColor());
			for(var i = 0;i < this._quest._rewards.length;i++) {
				var item = $gameParty.getContainer(this._quest._rewards[i].type)[this._quest._rewards[i].id];
				this.drawItemName(item, 6, yy);
				if(this._quest._rewards[i].amount > 1) {
					this.drawText("x"+this._quest._rewards[i].amount,6+this.textWidth(item.name)+42,yy,48);
				}
				yy += 36;
			}
		}
	}
	Window_QuestApply.prototype.resetFontSettings = function() {
		this.contents.fontFace = this.standardFontFace();
		this.resetTextColor();
	};
	Window_QuestApply.prototype.drawObjective = function(yy, obj) {
		this.drawText(obj.name,6,yy,this.contents.width-24);
		this.drawText(obj.current() + "/" + obj.max(),0,yy,this.contents.width,'right');
	}
	Window_QuestApply.prototype.show = function(quest, turnin) {
		this._quest = quest;
		if(this._quest.turnedIn()) { return; }
		if(turnin && !this._quest.accepted()) { return; }
		this.refresh();
		this.open();
		this._confirmWindow.quest(this._quest);
		this._turninWindow.quest(this._quest);
		if(turnin) {
			this._turninWindow.open();
		} else {
			this._confirmWindow.open();
		}
	}
	Window_QuestApply.prototype.hide = function() {
		this.close();
		this._confirmWindow.close();
		this._turninWindow.close();
	}
	Window_QuestApply.prototype.accept = function() {
		this._quest.accept();
	}
	Window_QuestApply.prototype.turnin = function() {
		this._quest.turnIn();
	}
	
	function Window_QuestConfirm() {
		this.initialize.apply(this, arguments);
	}
	Window_QuestConfirm.prototype = Object.create(Window_HorzCommand.prototype);
	Window_QuestConfirm.prototype.constructor = Window_QuestConfirm;
	Window_QuestConfirm.prototype.initialize = function() {
		Window_HorzCommand.prototype.initialize.call(this, Graphics.width/8,Graphics.width/8+Graphics.height-Graphics.width/8*2);
		this.openness = 0;
		this.active = false;
		this._enabled = true;
		this.refresh();
	}
	Window_QuestConfirm.prototype.windowWidth = function() { return Graphics.width/5*2; }
	Window_QuestConfirm.prototype.windowHeight = function() { return this.fittingHeight(1); }
	Window_QuestConfirm.prototype.makeCommandList = function() {
		this.addCommand(questCommandAccept,'accept');
		this.addCommand(questCommandDecline,'decline',this._enabled);
	}
	Window_QuestConfirm.prototype.itemWidth = function() {
		return this.width / 2 - this.padding * 2;
	}
	Window_QuestConfirm.prototype.open = function() {
		Window_HorzCommand.prototype.open.call(this);
		this.activate();
		this.select(0);
	}
	Window_QuestConfirm.prototype.quest = function(quest) {
		this._quest = quest;
		this._enabled = !this._quest._forceAccept;
		this.refresh();
	}
	Window_QuestConfirm.prototype.isCancelEnabled = function() {
		return Window_HorzCommand.prototype.isCancelEnabled.call(this) && this._enabled;
	}
	
	function Window_QuestTurnin() {
		this.initialize.apply(this, arguments);
	}
	Window_QuestTurnin.prototype = Object.create(Window_QuestConfirm.prototype);
	Window_QuestTurnin.prototype.constructor = Window_QuestTurnin;
	Window_QuestTurnin.prototype.initialize = function() {
		Window_QuestConfirm.prototype.initialize.call(this);
	}
	Window_QuestTurnin.prototype.quest = function(quest) {
		this._quest = quest;
		this._enabled = true;
		if(this._quest._forceTurnin && this._quest.completed()) { this._enabled = false; }
		this.refresh();
	}
	Window_QuestTurnin.prototype.makeCommandList = function() {
		if(this._quest) {
			this.addCommand(questCommandComplete,'accept',this._quest.completed());
			this.addCommand(questCommandCancel,'decline',this._enabled);
		}
	}
	
	var quest_game_party_initialize = Game_Party.prototype.initialize;
	Game_Party.prototype.initialize = function() {
		quest_game_party_initialize.call(this);
		if($gameQuests) { this.quests = $gameQuests._resetHash; }
		this._tracking = [];
	}
	Game_Party.prototype.getContainer = function(item) {
		if(item == "weapon") {return $dataWeapons; }
		if(item == "armor") {return $dataArmors; }
		if(item == "item") {return $dataItems; }
		return [];
	}
	
	var quest_game_player_update = Game_Player.prototype.update;
	Game_Player.prototype.update = function(sceneUpdate) {
		if(SceneManager._scene.accepting()) { return; }
		quest_game_player_update.call(this, sceneUpdate);
	}
	
	var quest_Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
	Game_Interpreter.prototype.pluginCommand = function(command, args) {
		quest_Game_Interpreter_pluginCommand.call(this, command, args);
		if(command === 'quest') { 
			if(args[0] === 'accept') {
				$gameQuests.getQuest(Number(args[1])).accept();
			}
			if(args[0] === 'askAccept') {
				SceneManager._scene.showQuest(Number(args[1]));
				this.setWaitMode('questAccept');
			}
			if(args[0] === 'abandon') {
				$gameQuests.getQuest(Number(args[1])).abandon();
			}
			if(args[0] === 'fail') {
				$gameQuests.getQuest(Number(args[1])).fail();
			}
			if(args[0] === 'turnin') {
				$gameQuests.getQuest(Number(args[1])).turnIn();
			}
			if(args[0] === 'askTurnin') {
				SceneManager._scene.showQuest(Number(args[1]),true);
				this.setWaitMode('questAccept');
			}
			if(args[0] === 'advance') {
				$gameQuests.getQuest(Number(args[1])).advObj(Number(args[2]),Number(args[3]));
			}
			if(args[0] === 'set') {
				$gameQuests.getQuest(Number(args[1])).setObj(Number(args[2]),Number(args[3]));
			}
			if(args[0] === 'hide') {
				$gameQuests.getQuest(Number(args[1])).objective(Number(args[2]))
				$gameParty.quests[Number(args[1])][Number(args[2])][1] = true;
			}
			if(args[0] === 'show') {
				$gameQuests.getQuest(Number(args[1])).objective(Number(args[2]))
				$gameParty.quests[Number(args[1])][Number(args[2])][1] = false;
			}
			if(args[0] === 'max') {
				$gameQuests.getQuest(Number(args[1])).objective(Number(args[2]))
				$gameParty.quests[Number(args[1])][Number(args[2])][2] = Number(args[3]);
			}
			if(args[0] === 'call') {
				questLogEntry = args[1] || 0;
				SceneManager.push(Scene_Quests);
			}
		}
	}
	var quest_Game_Interpreter_updateWaitMode = Game_Interpreter.prototype.updateWaitMode;
	Game_Interpreter.prototype.updateWaitMode = function() {
		var waiting = false;
		if(this._waitMode == 'questAccept') { waiting = SceneManager._scene.accepting()}
		if (!waiting) {
			waiting = quest_Game_Interpreter_updateWaitMode.call(this);
		}
		return waiting;
	};
	Game_Interpreter.prototype.obj = function(questId, objId) {
		return $gameQuests.getQuest(questId).objective(objId).current();
	}
	Game_Interpreter.prototype.objMax = function(questId, objId) {
		return $gameQuests.getQuest(questId).objective(objId).max();
	}
	Game_Interpreter.prototype.questAccepted = function(questId) {
		return $gameQuests.getQuest(questId).accepted();
	}
	Game_Interpreter.prototype.questCompleted = function(questId) {
		return $gameQuests.getQuest(questId).completed();
	}
	Game_Interpreter.prototype.questTurnedIn = function(questId) {
		return $gameQuests.getQuest(questId).turnedIn();
	}
	
})();