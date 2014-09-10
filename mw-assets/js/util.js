
/**
 * Class to provide utility functions for MineSweeper only
 * 
 * @since v1.0
 * @version 1.0
 * @author Waqar Alamgir <http://waqaralamgir.tk>
 */

Util = function()
{
	var that = this;
	
	that.getObject = function(x,y,blocksX,object)
	{
		return object[(x+y*(blocksX))];
	};
	
	that.collisionDetection = function(x,y,blocksX,blocksY)
	{
		return (x>-1 && x<blocksX && y>-1 && y<blocksY);
	};
	
	that.removeClass = function(arr , ele)
	{
		for(var i=0; i<arr.length; i++)
		{
			ele.removeClass(arr[i]);
		}
	};
	
	that.blockNode = function(i , j)
	{
		return $('.block[data-x="'+i+'"][data-y="'+j+'"]');
	}
};