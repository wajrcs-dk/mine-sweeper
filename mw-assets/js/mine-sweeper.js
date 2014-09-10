
/**
 * Core object for Game Settings
 * 
 * @since v1.0
 * @version 1.0
 * @author Waqar Alamgir <http://waqaralamgir.tk>
 */
 
MineSweeperGameSettings = {
	difficulty : {
		beginner : {
			difficulty: 'Beginner',
			blocksX: 8,
			blocksY: 8,
			maxMines: 10
		},
		intermediate: {
			difficulty: 'Intermediate',
			blocksX: 10,
			blocksY: 10,
			maxMines: 15
		},
		expert: {
			difficulty: 'Expert',
			blocksX: 16,
			blocksY: 16,
			maxMines: 25
		}
	}
};

/**
 * Block class for MineSweeper
 * 
 * @since v1.0
 * @version 1.0
 * @author Waqar Alamgir <http://waqaralamgir.tk>
 */
 
Block = function()
{
	/* Private identifiers */
	var that = this;
	that.isMine = 0;
	that.isOpened = 0;
	that.nearingMines = 0;
};

/**
 * Opened Blocks class for MineSweeper
 * 
 * @since v1.0
 * @version 1.0
 * @author Waqar Alamgir <http://waqaralamgir.tk>
 */
BlockOpen = function()
{
	/* Private identifiers */
	var that = this;
	that.x = 0;
	that.y = 0;
};

/**
 * Core View Object for MineSweeper
 * 
 * @since v1.0
 * @version 1.0
 * @author Waqar Alamgir <http://waqaralamgir.tk>
 */
GameViewObjects = {
	block: '<a class="btn btn-lg btn-default block" data-x="[X]" data-y="[Y]"></a>'
};

/**
 * Core class for Game Board
 * 
 * @since v1.0
 * @version 1.0
 * @author Waqar Alamgir <http://waqaralamgir.tk>
 */
 
MineSweaperBoard = function()
{
	var that = this;
	var face = $('.face-box .face');
	var grid = $('.grid');
	var blockEle;
	var gameSettings;
	
	/**
	 * The bootstrap for game board
	 */
	that.bootstrap = function(gameSettingsLocal)
	{
		gameSettings = gameSettingsLocal;
		_loadGameBoard();
		blockEle = $('.block');
		_bindEvents();
	};
	
	/**
	 * To bind click events on board
	 */
	function _bindEvents()
	{
		blockEle.unbind('click').bind('click' , function()
		{
			ms.hitBlock($(this));
		});
		
		face.bind('click' , function()
		{
			ms.hitFace($(this));
		});
	}
	
	/**
	 * Initialize the game with default/ db settings
	 */
	function _loadGameBoard()
	{
		var gridClasss = '_' + gameSettings.blocksX + 'x' + gameSettings.blocksY;
		grid.attr('class' , 'grid');
		grid.addClass(gridClasss);
		grid.html('');
		for(var j=0; j<gameSettings.blocksY; j++)
		{
			for(var i=0; i<gameSettings.blocksX; i++)
			{
				var view = GameViewObjects.block;
				grid.append(view.replace('[X]' , i).replace('[Y]' , j));
			}
		}
	}
};

MineSweeper = function()
{
	/* Private identifiers */
	var that = this;
	var blocksData = [];
	var openedBlocksData = [];
	var gameSettings = MineSweeperGameSettings.difficulty.beginner;
	var board = new MineSweaperBoard();
	var loose = 0;
	var win = 0;
	var numOfMoves = 0;
	var openedBlocks = 0;
	var markedCount = -1;
	var highestStackHeight = -1;
	var maxNoOfBlocks;
	
	var faceSmilies = ['smile' , 'win' , 'dead' , 'speechless'];
	var mineStates = ['explode' , 'reveal'];
	var blockClasses = ['mine','active','_0','_1','_2','_3','_4','_5','_6','_7','_8'];
	
	// Dom Elements
	var face = $('.face-box .face');
	var blockEle;
	var menuGameEle = $('#menu_game');
	var newGameEle = $('#new_game');
	var difficultyEle = null;
	var help = $('#help');
	var about = $('#about');
	
	/**
	 * Initialize the game
	 */
	that.bootstrap = function(gameSettingsParam)
	{
		/* Setting "Game Settings" */
		if(gameSettingsParam)
		{
			gameSettings = gameSettingsParam;
		}
		else
		{
			_loadGameSettings();
		}
		
		_newGame();
		
		newGameEle.click(function()
		{
			_restGame();
		});
		
		for(var key in MineSweeperGameSettings.difficulty)
		{
			var d = MineSweeperGameSettings.difficulty[key];
			var check = '<span class="glyphicon"></span>';
			if(gameSettings.difficulty == d.difficulty)
			{
				check = '<span class="glyphicon glyphicon-ok"></span>';
			}
			menuGameEle.append('<li><a href="#_" class="difficulty" data-id="' + key + '">' + check + ' ' + d.difficulty + '</a></li>');
		}
		
		difficultyEle = $('.difficulty');
		difficultyEle.click(function()
		{
			var id = $(this).attr('data-id');
			$('.difficulty .glyphicon').removeClass('glyphicon-ok');
			$(this).find('.glyphicon').addClass('glyphicon-ok');
			gameSettings = MineSweeperGameSettings.difficulty[id];
			_saveGameSettings();
			_newGame();
		});
		
		help.click(function()
		{
			bootbox.alert('<h3>Help</h3>Minesweeper is a grid of tiles, each of which may or may not cover hidden mines. The goal is to click on every tile except those that have mines. When a user clicks a tile, one of two things happens. If the tile was covering a mine, the mine is revealed and the game ends in failure. If the tile was not covering a mine, it instead reveals the number of adjacent (including diagonals) tiles that are covering mines – and, if that number was 0, behaves as if the user has clicked on every cell around it. When the user is confident that all tiles not containing mines have been clicked, the user presses a Validate button (often portrayed as a smiley-face icon) that checks the clicked tiles: if the user is correct, the game ends in victory, if not, the game ends in failure. <br/><br/>For Game Difficulty:<br/>1. Beginner 10 mines<br/>2. Intermediate 15 mines<br/>3. Expert 25 mines');
		});
		
		about.click(function()
		{
			bootbox.alert('<h3>About</h3>Minesweeper Online has been developed by Waqar Alamgir. If you like the game or wanted to contact, email me at <a href="mailto:waqarcs@yahoo.com">waqarcs@yahoo.com</a> or follow me at my github <a target="_blank" href="https://github.com/waqar-alamgir/">waqar-alamgir</a><br/><br/>Enjoy the game!');
		});
	};
	
	/**
	 * Face click call back
	 */
	that.hitFace = function(face)
	{
		_restGame();
		return false;
	};
	
	/**
	 * A block hit call back
	 */
	that.hitBlock = function(block)
	{
		if (!loose && !win)
		{
			var x = parseInt(block.attr('data-x'));
			var y = parseInt(block.attr('data-y'));
			numOfMoves++;
			if(numOfMoves == 1)
			{
				g_util.removeClass(faceSmilies , face);
				// Setting face to speechless
				face.addClass(faceSmilies[3]);
				
				// Init first click
				_firstClick(x,y);
			}
			
			var block = g_util.getObject(x , y , gameSettings.blocksX , blocksData);
			if(!block.isOpened)
			{
				_markBlockOpen(x,y);
				_openAllMarked();
			}
		}
	};
	
	/*****************************************************************************************************************/
	
	/**
	 * Called when a new game created
	 */
	function _newGame()
	{
		board.bootstrap(gameSettings);
		blockEle = $('.block');
		maxNoOfBlocks = (gameSettings.blocksX)*(gameSettings.blocksY)-1;
		for (var l=0; l<=maxNoOfBlocks; l++)
		{
			blocksData[l] = new Block();
		}
		_restGame();
	}
	
	/**
	 * Called when we need to create a new board
	 */
	function _makeNewBoard()
	{
		for (i=0; i<gameSettings.blocksX; i++)
		{
			for (j=0; j<gameSettings.blocksY; j++)
			{
				var block = g_util.getObject(i , j , gameSettings.blocksX , blocksData);
				block.isMine = 0;
				block.isOpened = 0;
				block.nearingMines = 0;
			}
		}
		openedBlocks = 0;
		myMines = gameSettings.maxMines;
		while (myMines)
		{
			_placeMineRandom();
			myMines--;
		}
	};
	
	/**
	 * When a game is rest
	 */
	function _restGame()
	{
		g_util.removeClass(faceSmilies , face);
		// Smile
		face.addClass(faceSmilies[0]);
		numOfMoves = 0;
		_makeNewBoard();
		_clearBoardClasses();
		loose = 0;
		win = 0;
	};
	
	/**
	 * Clears all board classes
	 */
	function _clearBoardClasses()
	{
		g_util.removeClass(blockClasses , blockEle);
		g_util.removeClass(mineStates , blockEle);
	};
	
	/**
	 * Initialize the game with default/ db settings
	 */
	function _loadGameSettings()
	{
		var gameSettingsDb = g_localDb.get(GAME_SETTINGS_KEY);
		
		/* If found */
		if(gameSettingsDb)
		{
			gameSettings  = JSON.parse(gameSettingsDb);
		}
	};
	
	/**
	 * Save game settings
	 */
	function _saveGameSettings()
	{
		g_localDb.set(GAME_SETTINGS_KEY , JSON.stringify(gameSettings));
	}
	
	/**
	 * Open all blocks existed in opened data object
	 */
	function _openAllMarked()
	{
		while (markedCount >= 0)
		{
			markedCount--;
			var bb = openedBlocksData[markedCount+1];
			
			_openABlock(bb.x , bb.y);
		}
	};
	
	/**
	 * Show loose window
	 */
	function _showloose()
	{
		loose = 1;
		for (i=0; i<gameSettings.blocksX ; i++)
		{
			for (j=0; j<gameSettings.blocksY ; j++)
			{
				var block = g_util.getObject(i , j , gameSettings.blocksX , blocksData);
				if (!block.isOpened)
				{
					if (block.isMine)
					{
						var blockEle = g_util.blockNode(i , j);
						// explode
						blockEle.addClass(mineStates[0]);
					}
				}
			}
		}
		g_util.removeClass(faceSmilies , face);
		// Setting face to happy/won
		face.addClass(faceSmilies[2]);
		bootbox.alert('<h3>You loos!</h3>Your score is ' + numOfMoves + '.');
	};

	/**
	 * Show win window
	 */
	function _showWin()
	{
		win = 1;
		g_util.removeClass(faceSmilies , face);
		// Setting face to happy/won
		face.addClass(faceSmilies[1]);
		bootbox.alert('<h3>You won!</h3>Your score ' + numOfMoves + '.');
	};
	
	/**
	 * Open all the adjucent blocks
	 */
	function _blockRecursiveOpen(x , y)
	{
		for (i=x-1; i<=x+1; i++)
		{
			for (j=y-1; j<=y+1; j++)
			{
				if (g_util.collisionDetection(i , j , gameSettings.blocksX , gameSettings.blocksY))
				{
					var block = g_util.getObject(i , j , gameSettings.blocksX , blocksData);
					if(!block.isOpened)
					{
						_markBlockOpen(i,j);
					}
				}
			}
		}
	};
	
	/**
	 * Open a single block
	 */
	function _openABlock(i , j)
	{
		var block = g_util.getObject(i , j , gameSettings.blocksX , blocksData);
		
		if(block.isMine)
		{
			var blockEle = g_util.blockNode(i , j);
			// 'reveal'
			blockEle.addClass(mineStates[1]);
			g_util.removeClass(faceSmilies , face);
			// 'loose'
			face.addClass(faceSmilies[2]);
			block.isOpened = 1;
			_showloose();
		}
		else
		{
			// FTS //
			var blockEle = g_util.blockNode(i , j);
			
			if(block.nearingMines>=0 && block.nearingMines<=8)
			{
				blockEle.addClass(blockClasses[block.nearingMines+2]);
			}
			
			block.isOpened = 1;
			openedBlocks++;
			
			if(block.nearingMines == 0)
			{
				blockEle.addClass(blockClasses[1]);
				_blockRecursiveOpen(i,j);
			}
			
			if (openedBlocks+gameSettings.maxMines-1 == maxNoOfBlocks)
			{
				// FTS //
				_showWin();
			}
		}
	};
	
	/**
	 * Mark block open
	 */
	function _markBlockOpen(x , y)
	{
		markedCount++;
		if(highestStackHeight < markedCount)
		{
			highestStackHeight++;
			openedBlocksData[markedCount] = new BlockOpen();
		}
		openedBlocksData[markedCount].x = x;
		openedBlocksData[markedCount].y = y;
		var block = g_util.getObject(x , y , gameSettings.blocksX , blocksData);
		block.isOpened = 1;
	}
	
	/**
	 * First click event
	 */
	function _firstClick(x , y)
	{
		if(1)
		
		var i = 0;
		var j = 0;
		
		for (i=x-1; i<=x+1; i++)
		{
			for (j=y-1; j<=y+1; j++)
			{
				if( g_util.collisionDetection(i , j , gameSettings.blocksX , gameSettings.blocksY) )
				{
					var block = g_util.getObject(i , j , gameSettings.blocksX , blocksData);
					block.isOpened = 1;
				}
			}
		}
		
		for (i=x-1; i<=x+1; i++)
		{
			for (j=y-1; j<=y+1; j++)
			{
				if( g_util.collisionDetection(i , j , gameSettings.blocksX , gameSettings.blocksY) )
				{
					if(g_util.getObject(i , j , gameSettings.blocksX , blocksData).isMine)
					{
						_removeMine(i,j);
						_placeMineRandom();
					}
				}
			}
		}
		
		for (i=x-1; i<=x+1; i++)
		{
			for (j=y-1; j<=y+1; j++)
			{
				if( g_util.collisionDetection(i , j , gameSettings.blocksX , gameSettings.blocksY) )
				{
					var block = g_util.getObject(i , j , gameSettings.blocksX , blocksData);
					block.isOpened = 0;
				}
			}
		}
	};
	
	/**
	 * Place mine random
	 */
	function _placeMineRandom()
	{
		minePlaced = 0;
		while (!minePlaced)
		{
			var i = Math.floor(Math.random() * ( gameSettings.blocksX ));
			var j = Math.floor(Math.random() * (gameSettings.blocksY ));
			
			minePlaced = _placeMine(i,j);
		}
	};
	
	/**
	 * Remove others mine
	 */
	function _removeOtherMines(i , j)
	{
		if( g_util.collisionDetection(i , j , gameSettings.blocksX , gameSettings.blocksY) )
		{
			var block = g_util.getObject(i , j , gameSettings.blocksX , blocksData);
			block.nearingMines--;
		}
	};
	
	/**
	 * Add others mine
	 */
	function _addOtherMines(x , y)
	{
		if(g_util.collisionDetection(x , y  , gameSettings.blocksX , gameSettings.blocksY))
		{
			var block = g_util.getObject(x , y , gameSettings.blocksX , blocksData);
			block.nearingMines++;
		}
		else
		{
			console.log('we can not set pointer');
		}
	};
	
	/**
	 * Place Mine
	 */
	function _placeMine(x , y)
	{
		var block = g_util.getObject(x , y , gameSettings.blocksX , blocksData);
		if(!block.isOpened && !block.isMine)
		{
			block.isMine = 1;
			for (i=x-1; i<=x+1; i++)
			{
				for (j=y-1; j<=y+1; j++)
				{
					_addOtherMines(i,j);
				}
			} 
			return 1;
		} 
		else
		{
			return 0;
		}
	};
	
	/**
	 * Remove mine
	 */
	function _removeMine(x , y)
	{
		for (i=x-1; i<=x+1; i++)
		{
			for (j=y-1; j<=y+1; j++)
			{
				_removeOtherMines(i,j);
			}
		}
		
		var block = g_util.getObject(x , y , gameSettings.blocksX , blocksData);
		block.isMine = 0;
		
		return true;
	}
};