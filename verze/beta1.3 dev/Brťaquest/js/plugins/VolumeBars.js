/*: 
* @plugindesc Displays bars for volume in configuration instead of numeric percentages.
* @author Orochii Zouveleki
* 
* @param Window Width
* @desc The width for the options window.
* @default 640
*
* @param Bar Color 1
* @desc First color for the gradient used to draw the bar.
* @default rgba(0,196,64,1.0)
*
* @param Bar Color 2
* @desc Second color for the gradient used to draw the bar.
* @default rgba(0,64,196,1.0)
*
* @param Vertical Gradient
* @desc 0: Horizontal gradient 1: Vertical gradient.
* @default 1
*
* @param Bar Background Color
* @desc Color used as the background for the bars.
* @default rgba(0,0,0,0.2)

*/
(function() {
	var parameters = PluginManager.parameters('VolumeBars');
    var windowWidth = String(parameters['Window Width'] || 640);
    var barColor1 = String(parameters['Bar Color 1'] || "rgba(0,196,64,1.0)");
    var barColor2 = String(parameters['Bar Color 2'] || "rgba(0,64,196,1.0)");
	var backColor = String(parameters['Bar Background Color'] || "rgba(0,0,0,0.1)");
	var verticalGradient = Number(parameters['Vertical Gradient']) != 0;
	
	var alias_addVolOptions = Window_Options.prototype.addVolumeOptions; //alias
	var volStartingIndex = 0;
	
	Window_Options.prototype.addVolumeOptions = function() {
		volStartingIndex = this.maxItems();
		alias_addVolOptions.call(this);
	};
	
	Window_Options.prototype.windowWidth = function() {
		return windowWidth;
	};

	Window_Options.prototype.drawItem = function(index) {
		var rect = this.itemRectForText(index);
		var statusWidth = this.statusWidth();
		var titleWidth = rect.width - statusWidth;
		this.resetTextColor();
		this.changePaintOpacity(this.isCommandEnabled(index));
		this.drawText(this.commandName(index), rect.x, rect.y, titleWidth, 'left');
		if (index < volStartingIndex || index > volStartingIndex+3) {
			this.drawText(this.statusText(index), titleWidth, rect.y, statusWidth, 'right');
		} else {
			var w = statusWidth * this.statusRaw(index) / 100;
			this.contents.fillRect(titleWidth-2, rect.y+4, statusWidth+4, 28, backColor);
			this.contents.gradientFillRect(titleWidth, rect.y+6, w, 24, barColor1, barColor2, verticalGradient); //ASDTsutarja
		}
	};

	Window_Options.prototype.statusRaw = function(index) {
		var symbol = this.commandSymbol(index);
		var value = this.getConfigValue(symbol);
		return value;
	};

})();