//=============================================================================
// SAN_ActorGenerator.js
//=============================================================================
// Copyright (c) 2015 Sanshiro
// Released under the MIT license
// http://opensource.org/licenses/mit-license.php
//=============================================================================

/*:
 * @plugindesc SAN_ActorGenerator ver1.00 
 * Generate actor by script command.
 * @author Sanshiro https://twitter.com/rev2nym
 * 
 * @help
 * This plugin generate actor that specified actor ID by script command.
 * To use each script command (function), show ActorGenerator class comment.
 * To use other that isn't implemented on this plugin, please make up
 * with event commands.
 * 
 * There is no plugin parameters, no plugin commands.
 *
 * It's possible to commercial use, distribute, and modify under the MIT license.
 * But, don't eliminate and don't alter a comment of the beginning.
 * If it's good, please indicate an author name on credit.
 * 
 * Author doesn't shoulder any responsibility in all kind of damage by using this.
 * And please don't expect support. X(
 */

/*:ja
 * @plugindesc アクター生成 ver1.00
 * スクリプトコマンドによりアクターを生成します。
 * @author サンシロ https://twitter.com/rev2nym
 * @version 1.00 2015/12/27 公開
 * 
 * @help
 * スクリプトコマンドにより指定したアクターIDのアクターを生成します。
 * 各スクリプトコマンド（関数）はActorGeneratorクラスのコメントを参照してください。
 * このプラグインに実装されていない機能はイベントコマンドで補ってください。
 * 
 * プラグインパラメータ、プラグインコマンドはありません。
 * 
 * MITライセンスのもと、商用利用、改変、再配布が可能です。
 * ただし冒頭のコメントは削除や改変をしないでください。
 * よかったらクレジットに作者名を記載してください。
 * 
 * これを利用したことによるいかなる損害にも作者は責任を負いません。
 * サポートは期待しないでください＞＜。
 */

var Imported = Imported || {};
Imported.SAN_ActorGenerator = true;

var Sanshiro = Sanshiro || {};
Sanshiro.ActorGenerator = Sanshiro.ActorGenerator || {};

//-----------------------------------------------------------------------------
// ActorGenerator
//
// アクター生成クラス

function ActorGenerator() {}

ActorGenerator._actorIdLastGenerated = undefined;

// Generate actor
// アクター生成
// baseActorId: Base actor's ID
//              生成のベースになるアクターのアクターID
// newActorId:  Generated actor's ID (can omission)
//              生成されたアクターのアクターID（省略可）
ActorGenerator.generateActor = function(baseActorId, newActorId) {
	if(newActorId === undefined) {
		for (newActorId = $dataActors.length; !!$gameActors.data()[newActorId]; newActorId++);
	}
	if (!$gameActors.data()[newActorId]) {
		$gameActors.data()[newActorId] = new Game_Actor(baseActorId);
		$gameActors.data()[newActorId].setActorId(newActorId);
		this._actorIdLastGenerated = newActorId;
	} else {
		this._actorIdLastGenerated = undefined;
	}
};

// Last generated actor's ID
// 最後に生成されたアクターのアクターID
ActorGenerator.actorIdLastGenerated = function() {
	return this._actorIdLastGenerated;
};

// Actor ID by party index
// パーティ順番によるアクターIDの取得
ActorGenerator.actorIdByPartyIndex = function(index) {
	return $gameParty.allMembers()[index].actorId();
};

// Add actor to party
// アクターのパーティ加入
ActorGenerator.changePartyMemberAdd = function(actorId) {
	$gameParty.addActor(actorId);
};

// Remove actor to party
// アクターのパーティ除外
ActorGenerator.changePartyMemberRemove = function(actorId) {
	$gameParty.removeActor(actorId);
};

// Change actor's equipment
// アクターの装備変更
ActorGenerator.changeEquipment = function(actorId, etypeId, itemId) {
	$gameActors[actorId].changeEquipById(etypeId, itemId);
};

// Change actor's name
// アクターの名前変更
ActorGenerator.changeName = function(actorId, name) {
	$gameActors[actorId].setName(name);
};

// Change actor's class
// アクターの職業変更
ActorGenerator.changeClass = function(actorId, classId, keepExp) {
	$gameActors[actorId].changeClass(classId, keepExp);
};

// Change actor's nickname
// アクターのニックネーム変更
ActorGenerator.changeNickname = function(actorId, nickname) {
	$gameActors[actorId].setNickname(nickname);
};

// Change actor's profile
// アクターのプロフィール変更
ActorGenerator.changeProfile = function(actorId, profile) {
	$gameActors[actorId].setProfile(profile);
};

// Change actor's face image
// アクターの顔画像変更
ActorGenerator.changeFaceImage = function(actorId, faceName, faceIndex) {
	$gameActors[actorId].setFaceImage(faceName, faceIndex);
};

// Change actor's walking character image
// アクターの歩行キャラ画像変更
ActorGenerator.changeCharacterImage = function(actorId, characterName, characterIndex) {
	$gameActors[actorId].setCharacterImage(characterName, characterIndex);
};

// Change actor's battler image
// アクターの戦闘キャラ画像変更
ActorGenerator.changeBattlerImage = function(actorId, battlerName) {
	$gameActors[actorId].setBattlerImage(battlerName);
};

//-----------------------------------------------------------------------------
// Game_Actors
//
// アクターズクラス

// アクターズクラスのアクター（エイリアス元でアクターオブジェクト生成）
Sanshiro.ActorGenerator.Game_Actors_actor = Game_Actors.prototype.actor;
Game_Actors.prototype.actor = function(actorId) {
	if (!!this._data[actorId]){
		return this._data[actorId]; 
	}
	return Sanshiro.ActorGenerator.Game_Actors_actor.call(this, actorId);
};

// アクターズクラスのアクターのリスト
Game_Actors.prototype.data = function() {
	return this._data;
};

//-----------------------------------------------------------------------------
//　Game_Actor
//
// アクタークラス

// アクタークラスの初期化
Sanshiro.ActorGenerator.Game_Actor_initialize = Game_Actor.prototype.initialize;
Game_Actor.prototype.initialize = function(actorId) {
    this._dataActorId = actorId;
	Sanshiro.ActorGenerator.Game_Actor_initialize.call(this, actorId);
};

// アクタークラスのデータベースのデータ
Game_Actor.prototype.actor = function() {
    return $dataActors[this._dataActorId];
};

// アクタークラスのアクターIDの設定
Game_Actor.prototype.setActorId = function(actorId) {
	this._actorId = actorId;
};