//==
// Icon Inventory and Item Details MV 1.0
//==

/*:
 * @plugindesc Turns inventory list into icons and/or provides a detailed info window
 * @author Vlue
 *
 * @param Use Icons
 * @desc Whether to display inventory items as icons or not
 * @default true
 *
 * @help Icon Inventory MV!
 *  Plug and play! No commands.
 *
 */

(function() {

	var useIcons = (PluginManager.parameters('IconInventory')['Use Icons'] || "true").toLowerCase() == "true";
	
	if(useIcons) {
	Window_ItemList.prototype.maxCols = function() {
		return Math.floor((this.width - this.standardPadding()) / (this.itemWidth() + this.spacing()));}
	Window_ItemList.prototype.maxPageRows = function() {
		return Math.floor((this.height - this.standardPadding()) / (this.itemHeight() + this.spacing()));}
	Window_ItemList.prototype.itemHeight = function() {return 45;}
	Window_ItemList.prototype.itemWidth = function() {return 45;}
	Window_ItemList.prototype.spacing = function() { return 6; }
	Window_ItemList.prototype.topRow = function() {return Math.floor(this._scrollY / (this.itemHeight() / this.spacing()));}
	Window_ItemList.prototype.setTopRow = function(row) {
		if(row < 0) {row = 0;}
		if(row > this.maxRows() - 1) {row = this.maxRows() - 1;}
		this._scrollY = row * (this.itemHeight() + this.spacing());
	}
	Window_ItemList.prototype.itemRect = function(index) {
		var rect = new Rectangle();
		rect.width = this.itemWidth();
		rect.height = this.itemHeight();
		rect.x = index % this.maxCols() * (this.itemWidth() + this.spacing()) + this.spacing();
		rect.y = Math.floor(index / this.maxCols()) * (this.itemHeight() + this.spacing()) + this.spacing();
		return rect;
	}
	Window_ItemList.prototype.drawItem = function(index) {
		var item = this._data[index];
		if(item) {
			var rect = this.itemRect(index);
			rect.width -= 4;
			rect.x += 2;
			this.drawIcon(item.iconIndex, rect.x+5, rect.y+6 );
			this.makeFontSmaller();
			var number = $gameParty.numItems(item);
			if(Number(number) > 1) {
				this.drawText("x" + number, rect.x + 20, rect.y + 18, 24);
			}
			this.makeFontBigger();
		}
	}
	}
	
	var iconInv_Scene_Item_create = Scene_Item.prototype.create;
	Scene_Item.prototype.create = function() {
		iconInv_Scene_Item_create.call(this);
		this._detailWindow = new Window_ItemDetail();
		this.addWindow(this._detailWindow);
		this._itemWindow.width = Graphics.width/3 * 2;
		this._itemWindow.refresh();
	}
	Scene_Item.prototype.update = function() {
		Scene_Base.prototype.update.call(this);
		this._detailWindow.setItem(this._itemWindow.item());
	}
	
	function Window_ItemDetail() {
		this.initialize.apply(this, arguments);
	}
	Window_ItemDetail.prototype = Object.create(Window_Base.prototype);
	Window_ItemDetail.prototype.constructor = Window_ItemDetail;
	Window_ItemDetail.prototype.initialize = function() {
		var x = Graphics.width/3*2;
		var y = this.fittingHeight(2) + this.fittingHeight(1);
		var width = Graphics.width/3;
		var height = Graphics.height - y;
		Window_Base.prototype.initialize.call(this, x, y, width, height)
		this._item = null;
	}
	Window_ItemDetail.prototype.setItem = function(item) {
		if(item == this._item) {return;}
		this._item = item;
		this.refresh();
	}
	Window_ItemDetail.prototype.refresh = function() {
		this.contents.clear();
		this.drawItemName(this._item,0,0,this.contents.width-24);
		this.makeFontSmaller();
		var yy = 48;
		if(DataManager.isWeapon(this._item) || DataManager.isArmor(this._item)) {
			for(var i = 0;i <= 7;i++) {
				console.log(this._item);
				if(this._item.params[i] != 0) {
					this.changeTextColor(this.systemColor());
					this.drawText(TextManager.param(i) + ":",24,yy,this.contents.width);
					this.changeTextColor(this.normalColor());
					this.drawText(this._item.params[i],24,yy,this.contents.width/2,"right");
					yy += 30;
				}
			}
		} else if (DataManager.isItem(this._item)) {
			var cures = [];
			for(var i = 0;i < this._item.effects.length;i++) {
				var effect = this._item.effects[i];
				if(effect.code == 11 && effect.value1 > 0) {
					this.drawTextEx("\\c[1]" + TextManager.hpA + "\\c[0] +" + Math.round(effect.value1 * 100) + "%",24,yy);yy+=30;
				}
				if(effect.code == 11 && effect.value2 > 0) {
					this.drawTextEx("\\c[1]" + TextManager.hpA + "\\c[0] +" + Math.round(effect.value2),24,yy);yy+=30;
				}
				if(effect.code == 12 && effect.value1 > 0) {
					this.drawTextEx("\\c[1]" + TextManager.mpA + "\\c[0] +" + Math.round(effect.value1 * 100) + "%",24,yy);yy+=30;
				}
				if(effect.code == 12 && effect.value2 > 0) {
					this.drawTextEx("\\c[1]" + TextManager.mpA + "\\c[0] +" + Math.round(effect.value2),24,yy);yy+=30;
				}
				if(effect.code == 22) {cures.push(effect.dataId);}
			}	
			if(cures.length > 0) {
				this.drawTextEx("\\c[1]Cures:\\c[0]",24,yy);yy+=30;
				for(var i = 0;i < cures.length;i++) {
					var name = $dataStates[cures[i]].name;
					this.drawText(name,48,yy,this.contents.width/2);
					yy+=24;
				}
			}	
		}
		this.makeFontBigger();
	}
	Window_ItemDetail.prototype.resetFontSettings = function() {}
	
	var iconInv_Scene_Equip_createItemWindow = Scene_Equip.prototype.createItemWindow;
	Scene_Equip.prototype.createItemWindow = function() {
		iconInv_Scene_Equip_createItemWindow.call(this);
		this._itemWindow.width = Graphics.width/3*2
		this._detailWindow = new Window_ItemDetail();
		this._detailWindow.y = this._itemWindow.y;
		this._detailWindow.height = this._itemWindow.height;
		this.addWindow(this._detailWindow);
	}
	Scene_Equip.prototype.update = function() {
		Scene_Base.prototype.update.call(this);
		this._detailWindow.setItem(this._itemWindow.item());
	}
	
})();