//=============================================================================
// SAN_CleatChoiceWindows.js
//=============================================================================
// Copyright (c) 2015 Sanshiro
// Released under the MIT license
// http://opensource.org/licenses/mit-license.php
//=============================================================================

/*:
 * @plugindesc 滑り止め選択ウィンドウ ver1.03a
 * 選択肢・数値入力・アイテム選択の誤入力を防止
 * @author サンシロ https://twitter.com/rev2nym
 * @version 1.03a 2015/12/20 プラグイン名をSAN_CleatChoiceWindows.jsに変更、MITライセンスに変更
 * 1.03 2015/11/14 プラグインパラメータ名のスペルミスを修正
 * 1.02 2015/11/14 選択肢ウィンドウの機能とブザー可否を既存の機能と重複しないよう変更
 * 1.01 2015/11/14 プラグインパラメータ名をエディタ準拠に変更
 * 1.00 2015/11/14 公開
 * 
 * @help
 * 選択肢・数値入力・アイテム選択のウィンドウのキー連打による誤入力を防止します。
 * 各ウィンドウが表示されたとき方向キーを入力することで決定することが可能になります。
 * 
 * これを利用したことによるいかなる損害にも作者は責任を負いません。
 * サポートは期待しないでください＞＜。
 * 
 * プラグインコマンドはありません。
 * 
 * @param ShowChoices
 * @desc 選択肢ウィンドウの滑り止め機能有効スイッチです。（ONで有効）
 * @default OFF
 *
 * @param InputNumber
 * @desc 数値入力ウィンドウの滑り止め機能有効スイッチです。（ONで有効）
 * @default OFF
 * 
 * @param SelectItem
 * @desc アイテム選択ウィンドウの滑り止め機能有効スイッチです。（ONで有効）
 * @default OFF
 * 
 * @param Buzzer
 * @desc 選択不能時のブザー音有効スイッチです。（OFFで無効）
 * @default OFF
 * 
 */

if (PluginManager.parameters('CleatChoiceWindows')['ShowChoices'] === 'ON') { (function() {

    //-----------------------------------------------------------------------------
    // Window_ChoiceList
    //
    // The window used for the event command [Show Choices].
    // 選択肢ウィンドウ (イベントコマンド[選択肢の表示])

    // プロパティ初期化
    var _rn_CleatChoiceWindows_Window_ChoiceList_initialize = Window_ChoiceList.prototype.initialize;
    Window_ChoiceList.prototype.initialize = function(messageWindow) {
        _rn_CleatChoiceWindows_Window_ChoiceList_initialize.call(this, messageWindow);
        this._isCleating = true;
    };
    
    // 処理開始
    var _rn_CleatChoiceWindows_Window_ChoiceList_start = Window_ChoiceList.prototype.start;
    Window_ChoiceList.prototype.start = function() {
        _rn_CleatChoiceWindows_Window_ChoiceList_start.call(this)
        this._isCleating = true;
    };
    
    // 初期選択
    Window_ChoiceList.prototype.selectDefault = function() {
        this.select($gameMessage.choiceDefaultType() === -1 ? 0 : $gameMessage.choiceDefaultType());
    };

    // 滑り止めフラグの更新
    Window_ChoiceList.prototype.updateIsCleating = function() {
        if (Input.isTriggered('up')   || Input.isTriggered('down') ||
                Input.isTriggered('left') || Input.isTriggered('right') ||
                TouchInput.isTriggered()) {
            this._isCleating = false;
        }
    };

    // 決定操作時の処理
    var _rn_CleatChoiceWindows_Window_ChoiceList_processOk = Window_ChoiceList.prototype.processOk;
    Window_ChoiceList.prototype.processOk = function() {
        if (this._isCleating){
            if (PluginManager.parameters('CleatChoiceWindows')['Buzzer'] === 'ON') {
                this.playBuzzerSound();
            }
            return;
        }
        _rn_CleatChoiceWindows_Window_ChoiceList_processOk.call(this);
    };

    // フレーム更新
    var _rn_CleatChoiceWindows_Window_ChoiceList_update = Window_ChoiceList.prototype.update;
    Window_ChoiceList.prototype.update = function() {
        _rn_CleatChoiceWindows_Window_ChoiceList_update.call(this)
        this.updateIsCleating();
    };
    
    // カーソル移動の更新
    _rn_CleatChoiceWindows_Window_ChoiceList_processCursorMove = Window_ChoiceList.prototype.processCursorMove;
    Window_ChoiceList.prototype.processCursorMove = function() {
        if (this._isCleating) {
            return;
        }
        _rn_CleatChoiceWindows_Window_ChoiceList_processCursorMove.call(this);
    };
    
    // カーソルスプライトの更新
    _rn_CleatChoiceWindows_Window_ChoiceList__updateCursor = Window_ChoiceList.prototype._updateCursor;
    Window_ChoiceList.prototype._updateCursor = function() {
        _rn_CleatChoiceWindows_Window_ChoiceList__updateCursor.call(this)
        this._windowCursorSprite.visible = this.isOpen() && !this._isCleating;
        if (!this._windowCursorSprite.visible) {
            this._animationCount = 0;
        }
    };
})(); }

(function () {
    var _rn_CleatChoiceWindows_Window_ChoiceList_playBuzzerSound = Window_ChoiceList.prototype.playBuzzerSound;
    Window_ChoiceList.prototype.playBuzzerSound = function() {
        if (PluginManager.parameters('CleatChoiceWindows')['Buzzer'] !== 'ON') {
            return;
        }
        _rn_CleatChoiceWindows_Window_ChoiceList_playBuzzerSound.call(this);
    };
})();

if (PluginManager.parameters('CleatChoiceWindows')['InputNumber'] === 'ON') { (function() {

    //-----------------------------------------------------------------------------
    // Window_NumberInput
    //
    // The window used for the event command [Input Number].
    // 数値入力ウィンドウ (イベントコマンド[数値入力の処理])

    // プロパティ初期化
    _rn_CleatChoiceWindows_Window_NumberInput_initialize = Window_NumberInput.prototype.initialize;
    Window_NumberInput.prototype.initialize = function(messageWindow) {
        _rn_CleatChoiceWindows_Window_NumberInput_initialize.call(this, messageWindow);
        this._isCleating = true;
    };

    // 処理開始
    _rn_CleatChoiceWindows_Window_NumberInput_start = Window_NumberInput.prototype.start;
    Window_NumberInput.prototype.start = function() {
        _rn_CleatChoiceWindows_Window_NumberInput_start.call(this)
        this._isCleating = true;
    };

    // 滑り止めフラグの更新
    Window_NumberInput.prototype.updateIsCleating = function() {
        if (Input.isTriggered('up')   || Input.isTriggered('down') ||
                Input.isTriggered('left') || Input.isTriggered('right') ||
                TouchInput.isTriggered()) {
            this._isCleating = false;
        }
    };

    // 決定操作時の処理
    _rn_CleatChoiceWindows_Window_NumberInput_processOk = Window_NumberInput.prototype.processOk;
    Window_NumberInput.prototype.processOk = function() {
        if (this._isCleating){
            if (PluginManager.parameters('CleatChoiceWindows')['Buzzer'] === 'ON') {
                this.playBuzzerSound();
            }
            return;
        }
        _rn_CleatChoiceWindows_Window_NumberInput_processOk.call(this);
    };

    // フレーム更新
    _rn_CleatChoiceWindows_Window_NumberInput_update = Window_NumberInput.prototype.update;
    Window_NumberInput.prototype.update = function() {
        _rn_CleatChoiceWindows_Window_NumberInput_update.call(this)
        this.updateIsCleating();
    };

    // カーソル移動の更新
    _rn_CleatChoiceWindows_Window_NumberInput_processCursorMove = Window_NumberInput.prototype.processCursorMove;
    Window_NumberInput.prototype.processCursorMove = function() {
        if (this._isCleating) {
            return;
        }
        _rn_CleatChoiceWindows_Window_NumberInput_processCursorMove.call(this);
    };
    
    // カーソルスプライトの更新
    _rn_CleatChoiceWindows_Window_NumberInput__updateCursor = Window_NumberInput.prototype._updateCursor;
    Window_NumberInput.prototype._updateCursor = function() {
        _rn_CleatChoiceWindows_Window_NumberInput__updateCursor.call(this)
        this._windowCursorSprite.visible = this.isOpen() && !this._isCleating;
        if (!this._windowCursorSprite.visible) {
            this._animationCount = 0;
        }
    };

})(); }

if (PluginManager.parameters('CleatChoiceWindows')['SelectItem'] === 'ON') { (function() {

    //-----------------------------------------------------------------------------
    // Window_EventItem
    //
    // The window used for the event command [Select Item].
    // アイテム選択ウィンドウ (イベントコマンド[アイテム選択の処理])

    // プロパティ初期化
    _rn_CleatChoiceWindows_Window_EventItem_initialize = Window_EventItem.prototype.initialize;
    Window_EventItem.prototype.initialize = function(messageWindow) {
        _rn_CleatChoiceWindows_Window_EventItem_initialize.call(this, messageWindow);
        this._isCleating = true;
    };

    // 処理開始
    _rn_CleatChoiceWindows_Window_EventItem_start = Window_EventItem.prototype.start;
    Window_EventItem.prototype.start = function() {
        _rn_CleatChoiceWindows_Window_EventItem_start.call(this)
        this._isCleating = true;
    };

    // 滑り止めフラグの更新
    Window_EventItem.prototype.updateIsCleating = function() {
        if (Input.isTriggered('up')   || Input.isTriggered('down') ||
                Input.isTriggered('left') || Input.isTriggered('right') ||
                TouchInput.isTriggered()) {
            this._isCleating = false;
        }
    };

    // 決定操作時の処理
    _rn_CleatChoiceWindows_Window_EventItem_processOk = Window_EventItem.prototype.processOk;
    Window_EventItem.prototype.processOk = function() {
        if (this._isCleating){
            if (PluginManager.parameters('CleatChoiceWindows')['Buzzer'] === 'ON') {
                this.playBuzzerSound();
            }
            return;
        }
        _rn_CleatChoiceWindows_Window_EventItem_processOk.call(this);
    };

    // フレーム更新
    _rn_CleatChoiceWindows_Window_EventItem_update = Window_EventItem.prototype.update;
    Window_EventItem.prototype.update = function() {
        _rn_CleatChoiceWindows_Window_EventItem_update.call(this)
        this.updateIsCleating();
    };
    
    // カーソル移動の更新
    _rn_CleatChoiceWindows_Window_EventItem_processCursorMove = Window_EventItem.prototype.processCursorMove;
    Window_EventItem.prototype.processCursorMove = function() {
        if (this._isCleating) {
            return;
        }
        _rn_CleatChoiceWindows_Window_EventItem_processCursorMove.call(this);
    };

    // カーソルスプライトの更新
    _rn_CleatChoiceWindows_Window_EventItem__updateCursor = Window_EventItem.prototype._updateCursor;
    Window_EventItem.prototype._updateCursor = function() {
        _rn_CleatChoiceWindows_Window_EventItem__updateCursor.call(this)
        this._windowCursorSprite.visible = this.isOpen() && !this._isCleating;
        if (!this._windowCursorSprite.visible) {
            this._animationCount = 0;
        }
    };

})(); }
