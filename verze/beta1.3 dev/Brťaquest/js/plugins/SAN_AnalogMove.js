//=============================================================================
// SAN_AnalogMove.js
//=============================================================================
// Copyright (c) 2015 Sanshiro
// Released under the MIT license
// http://opensource.org/licenses/mit-license.php
//=============================================================================

/*:
 * @plugindesc SAN_AnalogMove ver1.33 : Movement of 1 pixel unit.
 * Analog Stick and Touch Pad are supported. 
 * @author Sanshiro https://twitter.com/rev2nym
 * 
 * @help
 * Change player's movement to 1 pixel movement that isn't depend tiles.
 * Arrow Key, Analog Stick and Touch Pad are supported.
 * 
 * It's possible to commercial use, distribute, and modify under the MIT license.
 * But, don't eliminate and don't alter a comment of the beginning.
 * If it's good, please indicate an author name on credit.
 * 
 * Author doesn't shoulder any responsibility in all kind of damage by using this.
 * And please don't expect support. X(
 * 
 * Plugin Command
 *   AnalogMove ON            # Allow AnalogMove system working.
 *   AnalogMove OFF           # Disallow AnalogMove system working.
 *   AnalogMove Player ON     # Allow player and followers analog moving.
 *   AnalogMove Player OFF    # Disallow player and followers analog moving.
 *   
 * @param Valid
 * @desc Initial valid flag of AnalogMove system. ('ON' is valid)
 * @default OFF
 *
 * @param Player
 * @desc Initial valid flag of player and followers analog moving. ('ON' is valid)
 * @default OFF
 *
 */

/*:ja
 * @plugindesc アナログムーブ ver1.33
 * 1ピクセル単位の移動 アナログスティック・タッチパッド対応
 * @author サンシロ https://twitter.com/rev2nym
 * @version 1.33 2015/11/29 プラグインパラメータが反映されない不具合を修正
 * 1.32 2015/11/29 スルー有効時の挙動に関連してフォロワーの挙動を修正
 * 1.31 2015/11/28 コード整理、プレイヤーのスルー有効時の挙動、飛行艇時に決定ボタン・接触イベントが起動する不具合を修正
 * 1.30 2015/11/26 モジュール名をSAN_AnalogMove.jsに変更、名前空間の追加、乗り物に対応
 * 1.27a 2015/11/25 英語ドキュメント追加
 * 1.27 2015/11/24 MITライセンスに変更、セーブファイルから衝突マップを除外、ルート指定時の向き反映の不具合を修正
 * 1.26 2015/11/20 フォロワーの位置反映、イベント中の歩行アニメ、通行判定を暫定修正
 * 1.25 2015/11/16 フォロワーの向き固定移動の不具合と初期ON起動時にエラー終了する不具合を修正
 * 1.24 2015/11/15 機能有効フラグの状態をセーブファイルに保存するよう修正
 * 1.23 2015/11/14 通行不能タイルの接触イベント起動を追加、ルート指定移動の向き反映を修正
 * 1.22 2015/11/12 ウィンドウを閉じた後のマウス・タッチパッドの感度、座標指定移動の終了条件を調整
 * 1.21 2015/11/11 茂み表示、向き反映、プライオリティの異なるイベントの起動の不具合を修正
 * 1.20 2015/11/10 タッチパッドに対応、向き反映、イベント中の移動、マップ端の通行判定の不具合を修正
 * 1.10 2015/11/09 ランダムエンカウントに対応、プラグインパラメータ読込みの不具合を修正
 * 1.01 2015/11/08 角度の誤計算を修正、ループマップ使用可能
 * 1.00 2015/11/08 フォロワーの移動速度を微調整、リリースバージョンにアップ
 * 0.90 2015/11/08 プラグインパラメータ・コマンド、移動ルートの指定、フォロワー表示・集合などに対応
 * 0.12 2015/11/08 セーブ＆ロードに暫定対応
 * 0.11 2015/11/07 複数のイベントに同時に接触したときエラー終了する不具合を修正
 * 0.10 2015/11/06 公開
 * 
 * @help
 * プレイヤーキャラクターの移動をタイルによらない1ピクセル単位の移動に変更します。
 * 方向キー、アナログスティック、タッチパッド入力に対応しています。
 * 
 * MITライセンスのもと、商用利用、改変、再配布が可能です。
 * ただし冒頭のコメントは削除や改変をしないでください。
 * よかったらクレジットに作者名を記載してください。
 * 
 * これを利用したことによるいかなる損害にも作者は責任を負いません。
 * サポートは期待しないでください＞＜。
 * 
 * プラグインコマンド
 *   AnalogMove ON            # アナログムーブ機能有効化
 *   AnalogMove OFF           # アナログムーブ機能無効化
 *   AnalogMove Player ON     # プレイヤーとフォロワーのアナログムーブ有効化
 *   AnalogMove Player OFF    # プレイヤーとフォロワーのアナログムーブ無効化
 *
 * @param Valid
 * @desc アナログムーブ機能の有効フラグの初期値です。（ONで有効）
 * @default OFF
 *
 * @param Player
 * @desc プレイヤーとフォロワーのアナログムーブ有効フラグの初期値です。（ONで有効）
 * @default OFF
 *
 */

var Imported = Imported || {};
Imported.SAN_AnalogMove = true;

var Sanshiro = Sanshiro || {};
Sanshiro.Game_AnalogMove = Sanshiro.Game_AnalogMove || {};

//-----------------------------------------------------------------------------
// Game_AnalogMove
//
// アナログムーブクラス
function Game_AnalogMove() {
    this.initialize.apply(this, arguments);
};

// アナログムーブクラス初期化
Game_AnalogMove.prototype.initialize = function(thisCharacter) {
    this._crntRealX    = thisCharacter._realX;        // 現在マップ実 X 座標
    this._nextRealX    = thisCharacter._realX;        // 次回マップ実 X 座標
    this._crntRealY    = thisCharacter._realY;        // 現在マップ実 Y 座標
    this._nextRealY    = thisCharacter._realY;        // 次回マップ実 Y 座標
    this._targRealX    = undefined;                   // 目標マップ実 X 座標
    this._targRealY    = undefined;                   // 目標マップ実 Y 座標
    this._dir4         = thisCharacter.direction();   // キャラクターの向き
    this._distancePerFrame = 0.0;                     // フレーム間移動距離（ピクセル）
    this._directionRadian  = this.dir8ToRadian(thisCharacter.direction()); // 現在進行方位
    this._targetRadian     = this.dir8ToRadian(thisCharacter.direction()); // 目標進行方位
    this._directionRadianVariate = Math.PI*2.0;       // 進行方位変化量
    this._encounterCount   = 0.0;                     // エンカウント歩数
    this._collideEvents    = new Array();             // 接触イベント
    this._isMoving         = false;                   // 移動中判定
    this._isThrough        = false;                   // すり抜け判定
    this._valid            = false;                   // アナログムーブ個別キャラクター有効フラグ
};

// アナログムーブ個別キャラクター有効フラグの設定
Game_AnalogMove.prototype.setValid = function(valid) {
    this._valid = valid;
};

// アナログムーブ個別キャラクター有効判定
Game_AnalogMove.prototype.isValid = function() {
    return $gameSystem.analogMoveValid() && this._valid;
};

// アナログムーブ移動可能判定
Game_AnalogMove.canMove = function() {
    return $gamePlayer.canMove() && !SceneManager.isSceneChanging();
};

// フレーム更新
Game_AnalogMove.prototype.update = function(thisCharacter) {
    this._crntRealX = thisCharacter._realX;
    this._crntRealY = thisCharacter._realY;
    this._nextRealX = thisCharacter._realX;
    this._nextRealY = thisCharacter._realY;
    this.updateDirectionRadian();
    this.updateDir4(thisCharacter);
    this.updateNextRealXY(thisCharacter);
    this.updateTargetRealXY(thisCharacter);
    this.updateIsMoving(thisCharacter);
    this.updateIsThrough(thisCharacter);
    this.updateEncounterCount(thisCharacter);
    this.updateCharacterPosition(thisCharacter);
};

// 目標座標の更新
Game_AnalogMove.prototype.updateTargetRealXY = function(thisCharacter) {
    if (!Game_AnalogMove.canMove() ||
            this.deltaXY(thisCharacter._realX, thisCharacter._realY, this._nextRealX, this._nextRealY) < this._distancePerFrame / 16.0) {
        this._targRealX = undefined;
        this._targRealY = undefined;
    }
}

// エンカウント歩数の更新
Game_AnalogMove.prototype.updateEncounterCount = function(thisCharacter) {
    if (thisCharacter === $gamePlayer && Game_AnalogMove.canMove() && $gamePlayer.canEncounter()) {
        this._encounterCount += Math.sqrt(
                Math.pow((thisCharacter._realX - this._nextRealX), 2) +
                Math.pow((thisCharacter._realY - this._nextRealY), 2));
    }
};

// エンカウント歩数
Game_AnalogMove.prototype.encounterCount = function() {
    var encounterCount = this._encounterCount;
    this._encounterCount = 0.0;
    return encounterCount;
};

// キャラクター位置の更新
Game_AnalogMove.prototype.updateCharacterPosition = function(thisCharacter) {
    thisCharacter.setDirectionAnalog(this.dir4());
    if (Game_AnalogMove.canMove() && this.isMoving()) {
        thisCharacter._realX = this._nextRealX;
        thisCharacter._realY = this._nextRealY;
        thisCharacter._x = Math.round(thisCharacter._realX);
        thisCharacter._y = Math.round(thisCharacter._realY);
        thisCharacter.resetStopCount();
    }
};

// キー入力による目標方位角度と移動速度の更新
Game_AnalogMove.prototype.moveByInput = function(thisCharacter) {
    if (!$gamePlayer.canMove()) {
        this._distancePerFrame = 0.0;
        return;
    }
    var stick = Input.leftStick();
    if (TouchInput.isTriggered() || TouchInput.isRepeated()) {
        this._targRealX = this.canvasToMapX(TouchInput.x);
        this._targRealY = this.canvasToMapY(TouchInput.y);
    } 
    if (stick !== undefined && stick.tilt !== 0.0) {
        this._targetRadian = this.normalizeRadian(stick.direction);
        this._distancePerFrame = thisCharacter.distancePerFrame() * stick.tilt;
        this._targRealX = undefined;
        this._targRealY = undefined;
    } else if (this.dir8ToRadian(Input.dir8) !== undefined) {
        this._targetRadian = this.dir8ToRadian(Input.dir8);
        this._distancePerFrame = thisCharacter.distancePerFrame();
        this._targRealX = undefined;
        this._targRealY = undefined;
    } else if (this._targRealX !== undefined && this._targRealY !== undefined) {
        var distanceRate = Math.min(this.deltaXYFrom(this._targRealX, this._targRealY), 1.0);
        distanceRate = (distanceRate < 0.1 ? 0.0 : distanceRate);
        this._targetRadian = this.towardDirectionRadian(this._targRealX, this._targRealY);
        this._distancePerFrame = thisCharacter.distancePerFrame() * distanceRate;
        if (distanceRate === 0.0) {
            this._targRealX = undefined;
            this._targRealY = undefined;
        }
    } else {
        this._distancePerFrame = 0.0;
    }
};

// 画面 X 座標をマップ X 座標に変換
Game_AnalogMove.prototype.canvasToMapX = function(x) {
    var tileWidth = $gameMap.tileWidth();
    var originX = $gameMap._displayX * tileWidth;
    var mapX = (originX + x) / tileWidth;
    return $gameMap.roundX(mapX);
};

// 画面 Y 座標をマップ Y 座標に変換
Game_AnalogMove.prototype.canvasToMapY = function(y) {
    var tileHeight = $gameMap.tileHeight();
    var originY = $gameMap._displayY * tileHeight;
    var mapY = (originY + y) / tileHeight;
    return $gameMap.roundY(mapY);
};

// キャラクター追従による目標方位角度と移動速度の更新
Game_AnalogMove.prototype.followCharacter = function(thisCharacter, targetCharacter) {
    this._crntRealX = thisCharacter._realX;
    this._crntRealY = thisCharacter._realY;
    var deltaXYFromTarget = this.deltaXYFrom(targetCharacter._realX + 0.5, targetCharacter._realY + 0.5);
    this._targetRadian = this.towardDirectionRadian(targetCharacter._realX + 0.5, targetCharacter._realY + 0.5);
    if (deltaXYFromTarget <= 1.0) {
        this._distancePerFrame = thisCharacter.distancePerFrame() * 0.0;
    } else {
        var distanceRate = deltaXYFromTarget;
        distanceRate += Math.pow(distanceRate - 1.0, 2) - 0.125; 
        distanceRate = distanceRate > 2.0 ? 2.0 : distanceRate;
        this._distancePerFrame = thisCharacter.distancePerFrame() * distanceRate;
    }
};

// 目標方向に向けて進行方位を更新
Game_AnalogMove.prototype.updateDirectionRadian = function() {
    if (this._directionRadian === this._targetRadian) {
        return;
    }
    var differentialRadian = this.normalizeRadian(this._targetRadian - this._directionRadian);
    if (differentialRadian >= Math.PI) {
        differentialRadian -= Math.PI * 2.0;
    }
    differentialRadian < 0 ?
        this._directionRadian += Math.max(differentialRadian, -this._directionRadianVariate) :
        this._directionRadian += Math.min(differentialRadian,  this._directionRadianVariate);
    this._directionRadian = this.normalizeRadian(this._directionRadian);
};

// ラジアン角度を整形
Game_AnalogMove.prototype.normalizeRadian = function(radian) {
    while (radian < 0) radian += (Math.PI * 2.0);
    return radian % (Math.PI * 2.0);
};

// クラス内部の実座標の更新
Game_AnalogMove.prototype.updateNextRealXY = function(thisCharacter) {
    this._collideEvents = new Array();
    this._isMoving = false;
    var evadeDirectionRadian = this._directionRadian;
    var splitDistances = this.splitDistances();
    splitDistances.forEach(function(splitDistance) {
        this.calculateNextRealXY(splitDistance, this._directionRadian);
        var collideCharacters = this.collideCharacters(thisCharacter, splitDistance);
        var collideWallXY = this.collideWallXY(thisCharacter, splitDistance);
        var collideCornerXY = this.collideCornerXY(thisCharacter, splitDistance);
        if (collideCharacters.length === 0) {
            if (collideCornerXY !== undefined) {
                evadeDirectionRadian = this.evadeDirectionRadian(collideCornerXY.x, collideCornerXY.y, this._directionRadian);
                splitDistance *= Math.abs(Math.cos(evadeDirectionRadian - this._directionRadian));
                this.calculateNextRealXY(splitDistance, evadeDirectionRadian);
            }
            if (collideWallXY.x !== undefined) {
                this._nextRealX = Math.round(this._nextRealX);
            }
            if (collideWallXY.y !== undefined) {
                this._nextRealY = Math.round(this._nextRealY);
            }
        } else if (collideCharacters.length === 1 && collideWallXY.x === undefined && collideWallXY.y === undefined && collideCornerXY === undefined) {
            evadeDirectionRadian = this.evadeDirectionRadian(collideCharacters[0]._realX + 0.5, collideCharacters[0]._realY + 0.5, this._directionRadian);
            splitDistance *= Math.abs(Math.cos(evadeDirectionRadian - this._directionRadian));
            this.calculateNextRealXY(splitDistance, evadeDirectionRadian);
            if (this.collideCharacters(thisCharacter, splitDistance).length !== 0) {
                this._nextRealX = this._crntRealX;
                this._nextRealY = this._crntRealY;
            }
        } else {
            this._nextRealX = this._crntRealX;
            this._nextRealY = this._crntRealY;
        }
        this._crntRealX = this._nextRealX = ((this._nextRealX + $gameMap.width())  % $gameMap.width());
        this._crntRealY = this._nextRealY = ((this._nextRealY + $gameMap.height()) % $gameMap.height());
    }, this);
    // 衝突するイベントの更新
    this._collideEvents = this._collideEvents.filter(function(character, i, characters) {
        var eventId = $gameMap.events().indexOf(character);
        return (characters.indexOf(character) === i && $gameMap.events().indexOf(character) !== -1);
    });
};

// 分割フレーム間移動距離
Game_AnalogMove.prototype.splitDistances = function() {
    var unitDistanceVelocity = 1.0 / 4.0;
    var distancePerFrame = this._distancePerFrame;
    var distances = new Array();
    while (distancePerFrame > 0.0) {
        distances.push(Math.min(distancePerFrame, unitDistanceVelocity));
        distancePerFrame -= unitDistanceVelocity;
    }
    return distances;
};

// クラス内部の次移動座標の計算
Game_AnalogMove.prototype.calculateNextRealXY = function(distancePerFrame, directionRadian) {
    var distanceX = - distancePerFrame * Math.sin(directionRadian);
    var distanceY = - distancePerFrame * Math.cos(directionRadian);
    this._nextRealX = this._crntRealX + distanceX;
    this._nextRealY = this._crntRealY + distanceY;
};

// 指定座標への方位
Game_AnalogMove.prototype.towardDirectionRadian = function(x, y) {
    var deltaX = this.deltaXFrom(x);
    var deltaY = this.deltaYFrom(y);
    if (deltaX === 0.0) {
        return (deltaY > 0 ? Math.PI * 0.0 : Math.PI * 1.0);
    } else if (deltaY === 0.0) {
        return (deltaX > 0 ? Math.PI * 0.5 : Math.PI * 1.5);
    } else {
        return Math.atan2(deltaX, deltaY);
    }
};

// 指定座標を避ける方位角度
Game_AnalogMove.prototype.evadeDirectionRadian = function(x, y, directionRadian) {
    var towardDirectionRadian = this.towardDirectionRadian(x, y);
    var differentialRadian = this.normalizeRadian(towardDirectionRadian - directionRadian);
    if (differentialRadian > Math.PI) differentialRadian -= (Math.PI * 2.0);
    towardDirectionRadian += (differentialRadian < 0 ? Math.PI / 2.0 : - Math.PI / 2.0);
    return this.normalizeRadian(towardDirectionRadian);
};

// 衝突する全てのキャラクター
Game_AnalogMove.prototype.collideCharacters = function(thisCharacter, distancePerFrame) {
    if ($gamePlayer.isInAirship()) {
        return [];
    }
    var collideCharacters = this.allCharacters();
    collideCharacters = collideCharacters.filter(function(character) {
        return character !== thisCharacter && !character.isThrough();
    });
    collideCharacters = collideCharacters.filter(function(character) {
        var crntDistance = this.deltaXY(this._crntRealX, this._crntRealY, character._realX, character._realY)
        var nextDistance = this.deltaXY(this._nextRealX, this._nextRealY, character._realX, character._realY);
        if (nextDistance < crntDistance) {
            if (nextDistance < 0.5 - distancePerFrame) {
                this._collideEvents.push(character);
            } else if (nextDistance < 1.0 - distancePerFrame &&
                character._priorityType === thisCharacter._priorityType) {
                this._collideEvents.push(character);
                return true;
            }
        }
        return false;
    }, this);
    var self = this;
    collideCharacters.sort(function(character1, character2) {
        var distance1 = self.deltaXYFrom(character1._realX + 0.5, character1._realY + 0.5);
        var distance2 = self.deltaXYFrom(character2._realX + 0.5, character2._realY + 0.5);
        return (distance2 - distance1);
    });
    if (this.isThrough()) {
        return [];
    }
    return collideCharacters;
};

// マップ上の全てのキャラクター
Game_AnalogMove.prototype.allCharacters = function() {
    var player = [$gamePlayer];
    var events = $gameMap.events();
    var followers = $gamePlayer.followers().visibleFollowers();
    return ([$gamePlayer].concat($gameMap.events(), $gamePlayer.followers().visibleFollowers()));
};

// 衝突するイベント
Game_AnalogMove.prototype.collideEvents = function() {
    return this._collideEvents;
}

// 衝突する壁の座標
Game_AnalogMove.prototype.collideWallXY = function(thisCharacter, distancePerFrame) {
    var nextCenterX = this._nextRealX + 0.5;
    var nextCenterY = this._nextRealY + 0.5;
    var x = (Math.floor(nextCenterX) + $gameMap.width()).mod($gameMap.width());
    var y = (Math.floor(nextCenterY) + $gameMap.height()).mod($gameMap.height());
    var tile5 = Game_CollideMap._tiles[x][y];
    var wallX = undefined;
    var wallY = undefined;
    if (this._crntRealX >= this._nextRealX) {
        // 左の壁
        var x2 = $gameMap.roundX(Math.floor(nextCenterX - 0.5));
        if (!$gameMap.isValid(x2, y)) {
            wallX = tile5._x4;
        } else {
            var tile4 = Game_CollideMap._tiles[x2][y];
            if (tile4._e6 && Math.abs(this.deltaX(nextCenterX, tile5._x4)) < 0.5 + distancePerFrame) {
                this._collideEvents.push.apply(this._collideEvents, $gameMap.eventsXy(x2, y));
                if (!this.isThrough()) {
                    wallX = tile4._x6;
                }
            }
        }
    } else {
        // 右の壁
        var x2 = $gameMap.roundX(Math.floor(nextCenterX + 0.5));
        if (!$gameMap.isValid(x2, y)) {
            wallX = tile5._x6;
        } else {
            var tile6 = Game_CollideMap._tiles[x2][y];
            if (tile6._e4 && Math.abs(this.deltaX(nextCenterX, tile5._x6)) < 0.5 + distancePerFrame) {
                this._collideEvents.push.apply(this._collideEvents, $gameMap.eventsXy(x2, y));
                if (!this.isThrough()) {
                    wallX = tile6._x4;
                }
            }
        }
    }
    if (this._crntRealY >= this._nextRealY) {
        // 上の壁
        var y2 = $gameMap.roundY(Math.floor(nextCenterY - 0.5));
        if (!$gameMap.isValid(x, y2)) {
            wallY = tile5._y8;
        } else {
            var tile8 = Game_CollideMap._tiles[x][y2];
            if (tile8._e2 && Math.abs(this.deltaY(nextCenterY, tile5._y8)) < 0.5 + distancePerFrame) {
                this._collideEvents.push.apply(this._collideEvents, $gameMap.eventsXy(x, y2));
                if (!this.isThrough()) {
                    wallY = tile8._y2;
                }
            }
        }
    } else {
        // 下の壁
        var y2 = $gameMap.roundY(Math.floor(nextCenterY + 0.5));
        if (!$gameMap.isValid(x, y2)) {
            wallY = tile5._y2;
        } else {
            var tile2 = Game_CollideMap._tiles[x][y2];
            if (tile2._e8 && Math.abs(this.deltaY(nextCenterY, tile5._y2)) < 0.5 + distancePerFrame) {
                this._collideEvents.push.apply(this._collideEvents, $gameMap.eventsXy(x, y2));
                if (!this.isThrough()) {
                    wallY = tile2._y8;
                }
            }
        }
    }
    return {x: wallX, y: wallY};
};

// 衝突する角の座標
Game_AnalogMove.prototype.collideCornerXY = function(thisCharacter, distancePerFrame) {
    if (this.isThrough()) {
        return undefined;
    }
    var nextCenterX = this._nextRealX + 0.5
    var nextCenterY = this._nextRealY + 0.5
    if (this._nextRealX < this._crntRealX || this._nextRealY < this._crntRealY) {
        // 左上の角
        var x = (Math.floor(nextCenterX - 0.5) + $gameMap.width()).mod($gameMap.width());
        var y = (Math.floor(nextCenterY - 0.5) + $gameMap.height()).mod($gameMap.height());
        var tile7 = Game_CollideMap._tiles[x][y];
        if (tile7._a3 && this.deltaXY(nextCenterX, nextCenterY, tile7._x3, tile7._y3) < 0.5 - distancePerFrame) {
            return { x: tile7._x3, y: tile7._y3 };
        }
    }
    if (this._nextRealX < this._crntRealX || this._nextRealY > this._crntRealY) {
        // 左下の角
        var x = (Math.floor(nextCenterX - 0.5) + $gameMap.width()).mod($gameMap.width());
        var y = (Math.floor(nextCenterY + 0.5) + $gameMap.height()).mod($gameMap.height());
        var tile1 = Game_CollideMap._tiles[x][y];
        if (tile1._a9 && this.deltaXY(nextCenterX, nextCenterY, tile1._x9, tile1._y9) < 0.5 - distancePerFrame) {
            return { x: tile1._x9, y: tile1._y9 };
        }
    }
    if (this._nextRealX > this._crntRealX || this._nextRealY < this._crntRealY) {
        // 右上の角
        var x = (Math.floor(nextCenterX + 0.5) + $gameMap.width()).mod($gameMap.width());
        var y = (Math.floor(nextCenterY - 0.5) + $gameMap.height()).mod($gameMap.height());
        var tile9 = Game_CollideMap._tiles[x][y];
        if (tile9._a1 && this.deltaXY(nextCenterX, nextCenterY, tile9._x1, tile9._y1) < 0.5 - distancePerFrame) {
            return { x: tile9._x1, y: tile9._y1 };
        }
    }
    if (this._nextRealX > this._crntRealX || this._nextRealY > this._crntRealY) {
        // 右下の角
        var x = (Math.floor(nextCenterX + 0.5) + $gameMap.width()).mod($gameMap.width());
        var y = (Math.floor(nextCenterY + 0.5) + $gameMap.height()).mod($gameMap.height());
        var tile3 = Game_CollideMap._tiles[x][y];
        if (tile3._a7 && this.deltaXY(nextCenterX, nextCenterY, tile3._x7, tile3._y7) < 0.5 - distancePerFrame) {
            return { x: tile3._x7, y: tile3._y7 };
        }
    }
    return undefined;
};

// 移動中判定の更新
Game_AnalogMove.prototype.updateIsMoving = function(thisCharacter) {
    this._isMoving = (thisCharacter._realX !== this._nextRealX || thisCharacter._realY !== this._nextRealY);
};

// 移動中判定
Game_AnalogMove.prototype.isMoving = function() {
    return this._isMoving;
};

// すり抜け判定の更新
Game_AnalogMove.prototype.updateIsThrough = function(thisCharacter) {
    this._isThrough = thisCharacter.isThrough() && (thisCharacter.constructor !== Game_Follower || $gamePlayer.isThrough());
};

// すり抜け判定
Game_AnalogMove.prototype.isThrough = function() {
    return this._isThrough;
};

// 目標方位角度の設定
Game_AnalogMove.prototype.setTargetRadian = function(targetRadian) {
    this._targetRadian = targetRadian;
}

// 水平方向の距離
Game_AnalogMove.prototype.deltaX = function(x1, x2) {
    return $gameMap.deltaX(x1, x2)
};

// 垂直方向の距離
Game_AnalogMove.prototype.deltaY = function(y1, y2) {
    return $gameMap.deltaY(y1, y2)
};

// 座標間の距離
Game_AnalogMove.prototype.deltaXY = function(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow(this.deltaX(x1, x2), 2) + Math.pow(this.deltaY(y1, y2), 2));
};

// 現在座標との水平方向の距離
Game_AnalogMove.prototype.deltaXFrom = function(x) {
    return this.deltaX(this._crntRealX + 0.5, x);
};

// 現在座標との垂直方向の距離
Game_AnalogMove.prototype.deltaYFrom = function(y) {
    return this.deltaY(this._crntRealY + 0.5, y);
};

// 現在座標との距離
Game_AnalogMove.prototype.deltaXYFrom = function(x, y) {
    return this.deltaXY(this._crntRealX + 0.5, this._crntRealY + 0.5, x, y);
};

// 内部4方向を更新
Game_AnalogMove.prototype.updateDir4 = function(thisCharacter) {
    this._dir4 = thisCharacter.direction();
    this._dir4 = this.dir8ToDir4(this.radianToDir8(this._directionRadian));
};

// 内部4方向を取得
Game_AnalogMove.prototype.dir4 = function() {
    return this._dir4;
};

// 8方向による方位角度の設定
Game_AnalogMove.prototype.setDirectionRadianByDir8 = function(dir8) {
    this._targetRadian = this.dir8ToRadian(dir8);
    this._directionRadian = this._targetRadian;
};

// 8方向を4方向に変換
Game_AnalogMove.prototype.dir8ToDir4 = function(dir8) {
    if (dir8 % 2 === 0) {
        return dir8;
    }
    switch (this._dir4) {
    case 8:
        switch (dir8) {
        case 3:  return 6;
        case 1:  return 4;
        default: return 8;
        }
    case 6:
        switch (dir8) {
        case 1:  return 2;
        case 7:  return 8;
        default: return 6;
        }
    case 2:
        switch (dir8) {
        case 7:  return 4;
        case 9:  return 6;
        default: return 2;
        }
    case 4:
        switch (dir8) {
        case 9:  return 8;
        case 3:  return 2;
        default: return 4;
        }
    }
    return undefined;
};

// 方向角度を8方向に変換
Game_AnalogMove.prototype.radianToDir8 = function(radian) {
    radian = this.normalizeRadian(radian);
    return (
        radian < Math.PI / 8.0 *  1.0 ? 8 :
        radian < Math.PI / 8.0 *  3.0 ? 7 :
        radian < Math.PI / 8.0 *  5.0 ? 4 :
        radian < Math.PI / 8.0 *  7.0 ? 1 :
        radian < Math.PI / 8.0 *  9.0 ? 2 :
        radian < Math.PI / 8.0 * 11.0 ? 3 :
        radian < Math.PI / 8.0 * 13.0 ? 6 :
        radian < Math.PI / 8.0 * 15.0 ? 9 : 8
    )
};

// 8方向を方向角度に変換
Game_AnalogMove.prototype.dir8ToRadian = function(dir8) {
    return (
        dir8 === 8 ? Math.PI / 4.0  * 0.0 :
        dir8 === 7 ? Math.PI / 4.0  * 1.0 :
        dir8 === 4 ? Math.PI / 4.0  * 2.0 :
        dir8 === 1 ? Math.PI / 4.0  * 3.0 :
        dir8 === 2 ? Math.PI / 4.0  * 4.0 :
        dir8 === 3 ? Math.PI / 4.0  * 5.0 :
        dir8 === 6 ? Math.PI / 4.0  * 6.0 :
        dir8 === 9 ? Math.PI / 4.0  * 7.0 : undefined
    )
};

//-----------------------------------------------------------------------------
// Game_CollideMap
//
// 衝突マップ
Game_CollideMap = {};

// 衝突マップのセットアップ
Game_CollideMap.setup = function() {
    this._mapId = $gameMap.mapId()
    this._tiles = new Array();
    for (var x = 0; x < $gameMap.width(); x++) {
        this._tiles.push([]);
        for (var y = 0; y < $gameMap.height(); y++) {
            this._tiles[x].push(new Game_CollideTile(x, y));
        } 
    }
};

//-----------------------------------------------------------------------------
// Game_CollideTile
//
// 衝突タイルクラス
function Game_CollideTile () {
    this.initialize.apply(this, arguments);
};

// 衝突タイルクラスの初期化
Game_CollideTile.prototype.initialize = function(x, y) {
    this._x = Math.floor(x);
    this._y = Math.floor(y);
    this._x5 = this._x + 0.5;
    this._y5 = this._y + 0.5;
    this._x4 = this._x1 = this._x7 = this._x;
    this._x6 = this._x3 = this._x9 = x + 1.0;
    this._y8 = this._y7 = this._y9 = this._y;
    this._y2 = this._y1 = this._y3 = y + 1;
    this._e8 = !this.isPassable(this._x, this._y, 8);
    this._e6 = !this.isPassable(this._x, this._y, 6);
    this._e2 = !this.isPassable(this._x, this._y, 2);
    this._e4 = !this.isPassable(this._x, this._y, 4);
    this._a9 = (this._e8 || this._e6) && this.isCorner(9);
    this._a3 = (this._e6 || this._e2) && this.isCorner(3);
    this._a1 = (this._e2 || this._e4) && this.isCorner(1);
    this._a7 = (this._e4 || this._e8) && this.isCorner(7);
};

// 衝突タイルクラス通行可能判定 辺
Game_CollideTile.prototype.isPassable = function(x, y, d) {
    var x2 = $gameMap.roundXWithDirection(x, d);
    var y2 = $gameMap.roundYWithDirection(y, d);
    var d2 = $gamePlayer.reverseDir(d);
    return $gamePlayer.isMapPassable(x, y, d) && $gamePlayer.isMapPassable(x2, y2, d2) && $gameMap.isValid(x2, y2);
};

// 衝突タイルクラス通行可能判定 角
Game_CollideTile.prototype.isCorner = function(d) {
    switch (d) {
    case 9:  return this.isPassable(this._x, this._y - 1, 6) && this.isPassable(this._x + 1, this._y, 8);
    case 3:  return this.isPassable(this._x, this._y + 1, 6) && this.isPassable(this._x + 1, this._y, 2);
    case 1:  return this.isPassable(this._x, this._y + 1, 4) && this.isPassable(this._x - 1, this._y, 2);
    case 7:  return this.isPassable(this._x, this._y - 1, 4) && this.isPassable(this._x - 1, this._y, 8);
    default: return false;
    }
};

//-----------------------------------------------------------------------------
// Game_Map
//
// マップクラス

// マップクラスのセットアップ
Sanshiro.Game_AnalogMove.Game_Map_setup = Game_Map.prototype.setup;
Game_Map.prototype.setup = function(mapId) {
    Sanshiro.Game_AnalogMove.Game_Map_setup.call(this, mapId);
    Game_CollideMap.setup();
};

//-----------------------------------------------------------------------------
// Game_System
//
// システムクラス

// システムの初期化
Sanshiro.Game_AnalogMove.Game_System_initialize = Game_System.prototype.initialize;
Game_System.prototype.initialize = function() {
    Sanshiro.Game_AnalogMove.Game_System_initialize.call(this);
    this.setAnalogMoveValid(PluginManager.parameters('SAN_AnalogMove')['Valid'] === 'ON');
};

// システムの個別のアナログムーブ有効化フラグの設定
Game_System.prototype.setAnalogMoveValid = function(valid) {
    this._analogMoveValid = valid;
};

// システムの個別のアナログムーブ有効判定
Game_System.prototype.analogMoveValid = function() {
    return this._analogMoveValid;
};

//-----------------------------------------------------------------------------
// Input
//
// インプットクラス

// ゲームパッドステータスの更新
Sanshiro.Game_AnalogMove.Input_updateGamepadState = Input._updateGamepadState;
Input._updateGamepadState = function(gamepad) {
    Sanshiro.Game_AnalogMove.Input_updateGamepadState.call(this, gamepad);
    this._updateGamepadAxes(gamepad);
};

// アナログスティック値の更新
Input._updateGamepadAxes = function(gamepad) {
    this._axes = gamepad.axes;
};

// 左アナログスティック
Input.leftStick = function() {
    if (this._axes === undefined) {
        return undefined;
    }
    var threshold = 0.1;
    var x = this._axes[0];
    var y = this._axes[1];
    var tilt = (Math.pow(x, 2) + Math.pow(y, 2));
    if (tilt < threshold) {
        tilt = 0.0;
    } else if (tilt > 1.0) {
        tilt = 1.0;
    }
    var direction = 0.0
    if (x === 0.0) {
        direction = (-y > 0 ? Math.PI * 0.0 : Math.PI * 1.0);
    } else if (y === 0.0) {
        direction = (-x > 0 ? Math.PI * 0.5 : Math.PI * 1.5);
    } else {
        direction = Math.atan2(-x, -y);
    }
    return {tilt: tilt, direction: direction};
};

// 右アナログスティック
Input.rightStick = function() {
    if (this._axes === undefined) {
        return undefined;
    }
    var threshold = 0.1;
    var x = this._axes[2];
    var y = this._axes[3];
    var tilt = (Math.pow(x, 2) + Math.pow(y, 2));
    if (tilt < threshold) {
        tilt = 0.0;
    } else if (tilt > 1.0) {
        tilt = 1.0;
    }
    var direction = 0.0
    if (x === 0.0) {
        direction = (-y > 0 ? Math.PI * 0.0 : Math.PI * 1.0);
    } else if (y === 0.0) {
        direction = (-x > 0 ? Math.PI * 0.5 : Math.PI * 1.5);
    } else {
        direction = Math.atan2(-x, -y);
    }
    return {tilt: tilt, direction: direction};
};

//-----------------------------------------------------------------------------
// Scene_Map
//
// マップシーンクラス

// マップシーンクラスのメニューシーン呼び出し更新
Sanshiro.Game_AnalogMove.Scene_Map_updateCallMenu = Scene_Map.prototype.updateCallMenu;
Scene_Map.prototype.updateCallMenu = function() {
    var isMoving = $gamePlayer.isMoving;
    $gamePlayer.isMoving = function() { return false; };
    Sanshiro.Game_AnalogMove.Scene_Map_updateCallMenu.call(this);
    $gamePlayer.isMoving = isMoving;
};

// マップシーンクラスの開始処理
Sanshiro.Game_AnalogMove.Scene_Map_start = Scene_Map.prototype.start;
Scene_Map.prototype.start = function() {
    Sanshiro.Game_AnalogMove.Scene_Map_start.call(this);
    Game_CollideMap.setup();
};

//-----------------------------------------------------------------------------
// Game_CharacterBase
//
// キャラクターベースクラス

// キャラクターベースクラスのプロパティ初期化
Sanshiro.Game_AnalogMove.Game_CharacterBase_initMembers = Game_CharacterBase.prototype.initMembers;
Game_CharacterBase.prototype.initMembers = function() {
    Sanshiro.Game_AnalogMove.Game_CharacterBase_initMembers.call(this);
    this._analogMove = new Game_AnalogMove(this);
};

// キャラクターベースクラスの方向設定
Sanshiro.Game_AnalogMove.Game_CharacterBase_setDirection = Game_CharacterBase.prototype.setDirection;
Game_CharacterBase.prototype.setDirection = function(d) {
    Sanshiro.Game_AnalogMove.Game_CharacterBase_setDirection.call(this, d);
    if (!this.isDirectionFixed()) {
        this._analogMove.setDirectionRadianByDir8(this._direction);
    }
};

// キャラクターベースクラスのアナログムーブによる方向設定
Game_CharacterBase.prototype.setDirectionAnalog = function(d) {
    if (!this.isDirectionFixed()) {
        this._direction = d;
    }
};
    
// キャラクターベースクラスの移動中判定
Sanshiro.Game_AnalogMove.Game_CharacterBase_isMoving = Game_CharacterBase.prototype.isMoving;
Game_CharacterBase.prototype.isMoving = function() {
    if (this.isAnalogMoveValid()) {
        return this._analogMove.isMoving() && Game_AnalogMove.canMove();
    }
    return Sanshiro.Game_AnalogMove.Game_CharacterBase_isMoving.call(this);
};

// キャラクターベースクラスのフレーム更新
Sanshiro.Game_AnalogMove.Game_CharacterBase_update = Game_CharacterBase.prototype.update;
Game_CharacterBase.prototype.update = function() {
    if (this.isAnalogMoveValid()) {
        this._analogMove.update(this);
        var isMoving = this.isMoving;
        this.isMoving = function() { return false; };
        this.refreshBushDepth();
        this.isMoving = isMoving;
    }
    return Sanshiro.Game_AnalogMove.Game_CharacterBase_update.call(this);
};

// キャラクターベースクラスの移動更新
Sanshiro.Game_AnalogMove.Game_CharacterBase_updateMove = Game_CharacterBase.prototype.updateMove;
Game_CharacterBase.prototype.updateMove = function() {
    if (this.isAnalogMoveValid()) {
        return;
    }
    return Sanshiro.Game_AnalogMove.Game_CharacterBase_updateMove.call(this)
};

// キャラクターベースクラスの個別のアナログムーブ有効化フラグの設定
Game_CharacterBase.prototype.setAnalogMoveValid = function(valid) {
    this._analogMove.setValid(valid);
};

// キャラクターベースクラスの個別のアナログムーブ有効判定
Game_CharacterBase.prototype.isAnalogMoveValid = function() {
    return this._analogMove.isValid();
};

//-----------------------------------------------------------------------------
// Game_Character
//
// キャラクタークラス

// キャラクタークラスのルート指定移動
Sanshiro.Game_AnalogMove.Game_Character_updateRoutineMove = Game_Character.prototype.updateRoutineMove;
Game_Character.prototype.updateRoutineMove = function() {
    if (this.isAnalogMoveValid()) {
        return;
    }
    return Sanshiro.Game_AnalogMove.Game_Character_updateRoutineMove.call(this);
};

// キャラクタークラスの個別のアナログムーブ有効判定
Game_Character.prototype.isAnalogMoveValid = function() {
    return Game_CharacterBase.prototype.isAnalogMoveValid.call(this) && !this._moveRouteForcing;
};

//-----------------------------------------------------------------------------
// Game_Player
//
// プレイヤークラス

// プレイヤークラスのプロパティ初期化
Sanshiro.Game_AnalogMove.Game_Player_initMembers = Game_Player.prototype.initMembers;
Game_Player.prototype.initMembers = function() {
    Sanshiro.Game_AnalogMove.Game_Player_initMembers.call(this);
    this.setAnalogMoveValid(PluginManager.parameters('SAN_AnalogMove')['Player'] === 'ON');
    this._encounterCountAnalog = 0.0;
};

// プレイヤークラスのキー入力による移動
Sanshiro.Game_AnalogMove.Game_Player_moveByInput = Game_Player.prototype.moveByInput;
Game_Player.prototype.moveByInput = function() {
    if (this.isAnalogMoveValid()) {
        this._analogMove.moveByInput(this);
        this.checkEventTriggerTouchAnalog();
        this.checkEventTriggerActionAnalog();
        return;
    }
    return Sanshiro.Game_AnalogMove.Game_Player_moveByInput.call(this);
};

// プレイヤークラスのダッシュ状態の更新
Sanshiro.Game_AnalogMove.Game_Player_updateDashing = Game_Player.prototype.updateDashing;
Game_Player.prototype.updateDashing = function() {
    var isMoving = this.isMoving;
    this.isMoving = function() { return false };
    Sanshiro.Game_AnalogMove.Game_Player_updateDashing.call(this);
    this.isMoving = isMoving;
};

// プレイヤークラスのアナログムーブ時の接触イベント起動処理
Game_Player.prototype.checkEventTriggerTouchAnalog = function() {
    if (!this.isThrough() && !$gameMap.isEventRunning()) {
        this._analogMove.collideEvents().forEach(function(event) {
            if (event.isTriggerIn([1, 2])) {
                event.start();
            }
        });
    }
};

// プレイヤークラスのアナログムーブ時の決定ボタンイベント起動処理
Game_Player.prototype.checkEventTriggerActionAnalog = function() {
    this.triggerAction();
};

// プレイヤークラスの移動更新
Sanshiro.Game_AnalogMove.Game_Player_updateMove = Game_Player.prototype.updateMove;
Game_Player.prototype.updateMove = function() {
    if (this.isAnalogMoveValid()) {
        this.updateEncounterCountAnalog();
    }
    Sanshiro.Game_AnalogMove.Game_Player_updateMove.call(this);
};

// プレイヤークラスのアナログ移動エンカウント歩数カウントダウン
Game_Player.prototype.updateEncounterCountAnalog = function() {
    if (this.canEncounter()) {
        this._encounterCount -= this.encounterProgressValue() * this._analogMove.encounterCount();
    }
};

// プレイヤークラスの乗り物搭乗中のフレーム更新
Sanshiro.Game_AnalogMove.Game_Player_updateVehicleGetOn = Game_Player.prototype.updateVehicleGetOn;
Game_Player.prototype.updateVehicleGetOn = function() {
    Sanshiro.Game_AnalogMove.Game_Player_updateVehicleGetOn.call(this);
    if (!this._vehicleGettingOn) {
        Game_CollideMap.setup();
    }
};

// プレイヤークラスの乗り物下乗中のフレーム更新
Sanshiro.Game_AnalogMove.Game_Player_updateVehicleGetOff = Game_Player.prototype.updateVehicleGetOff;
Game_Player.prototype.updateVehicleGetOff = function() {
    Sanshiro.Game_AnalogMove.Game_Player_updateVehicleGetOff.call(this);
    if (!this._vehicleGettingOff) {
        Game_CollideMap.setup();
    }
};

// プレイヤークラスの個別のアナログムーブ有効判定
Game_Player.prototype.isAnalogMoveValid = function() {
    return Game_Character.prototype.isAnalogMoveValid.call(this) &&
        !this._followers.areGathering();
};

//-----------------------------------------------------------------------------
// Game_Follower
//
// フォロワークラス

// フォロワークラスの目標キャラクター追尾
Game_Follower.prototype.chaseCharacterAnalog = function(character) {
    this._analogMove.followCharacter(this, character);
};

// フォロワークラスのアナログムーブ有効判定
Game_Follower.prototype.isAnalogMoveValid = function() {
    return $gamePlayer.isAnalogMoveValid();
};

// フォロワークラスの移動更新
Sanshiro.Game_AnalogMove.Game_Follower_updateMove = Game_Follower.prototype.updateMove;
Game_Follower.prototype.updateMove = function() {
    Sanshiro.Game_AnalogMove.Game_Follower_updateMove.call(this);
};

//-----------------------------------------------------------------------------
// Game_Followers
//
// フォロワーズクラス

// フォロワーズクラスのフレーム更新
Sanshiro.Game_AnalogMove.Game_Followers_update = Game_Followers.prototype.update;
Game_Followers.prototype.update = function() {
    if ($gamePlayer.isAnalogMoveValid()) {
        this.updateMoveAnalog();
        this.forEach(function(follower) {
            follower.update();
        }, this);
        return;
    }
    Sanshiro.Game_AnalogMove.Game_Followers_update.call(this);
};

// フォロワーズクラスのアナログ移動の更新
Game_Followers.prototype.updateMoveAnalog = function() {
    for (var i = this._data.length - 1; i >= 0; i--) {
        var precedingCharacter = (i > 0 ? this._data[i - 1] : $gamePlayer);
        this._data[i].chaseCharacterAnalog(precedingCharacter);
    }
};

//-----------------------------------------------------------------------------
// Game_Interpreter
//
// インタープリタークラス

// プラグインコマンド
Sanshiro.Game_AnalogMove.Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
Game_Interpreter.prototype.pluginCommand = function(command, args) {
    Sanshiro.Game_AnalogMove.Game_Interpreter_pluginCommand.call(this, command, args);
    if (command === 'AnalogMove') {
        switch (args[0]) {
        case 'ON':
            $gameSystem.setAnalogMoveValid(true);
            break;
        case 'OFF':
            $gameSystem.setAnalogMoveValid(false);
            break;
        case 'Player':
            switch (args[1]) {
            case 'ON':
                $gamePlayer.setAnalogMoveValid(true);
                break;
            case 'OFF':
                $gamePlayer.setAnalogMoveValid(false);
                break;
            }
        break;
        }
    $gamePlayer.refresh();
    }
};
