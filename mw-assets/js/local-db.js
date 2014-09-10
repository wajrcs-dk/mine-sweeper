
/**
 * Class to store data on client browser using HTML5 Local Storage.
 * 
 * @since v1.0
 * @version 1.0
 * @author Waqar Alamgir <http://waqaralamgir.tk>
 */

LocalDb = function()
{
	var that = this;
	
	/* If localStorage is supported by client browser, assume it's not */
	that._isSupported = 0;
};

/**
 * Initialize LocalDb
 * 
 * @author Waqar Alamgir <http://waqaralamgir.tk>
 */
LocalDb.prototype.init = function()
{
	var that = this;
	
	/* If localStorage not exists */
	if (typeof(localStorage) == 'undefined')
	{
		that._isSupported = 0;
	}
	else
	{
		that._isSupported = 1;
		that.reset();
	}
};

/**
 * Reset LocalDb
 * 
 * @author Waqar Alamgir <http://waqaralamgir.tk>
 */
LocalDb.prototype.reset = function()
{
	var that = this;
	var localKey = this.get(g_localStorageVerKey);

	/* Clearing local storage */
	if(localKey != null && localKey != g_localStorageVersion)
	{
		that.clear();
	}
	/* Setting local storage version no */
	that.set(g_localStorageVerKey , g_localStorageVersion);
};

/**
 * Set an item in LocalDb
 * 
 * @author Waqar Alamgir <http://waqaralamgir.tk>
 */
LocalDb.prototype.set = function(key , value)
{
	var that = this;
	
	/* If it is supported */
	if(that._isSupported == 1)
	{
		try
		{
			localStorage.setItem(g_cachePath + key , value);
			return 1;
		}
		catch (e)
		{
			/*if (e == QUOTA_EXCEEDED_ERR)
			{
			}*/
			
			// Most likely storage full let's clear it
			that.clear();
			localStorage.setItem(g_cachePath + key , value);
			return 1;
		}
	}
	return 0;
};

/**
 * Get an item from LocalDb
 * 
 * @author Waqar Alamgir <http://waqaralamgir.tk>
 */
LocalDb.prototype.get = function(key)
{
	var that = this;
	
	/* If it is supported */
	if(that._isSupported == 1)
	{
		return localStorage.getItem(g_cachePath + key);
	}
	else
	{
		return null;
	}
};

/**
 * Delete an item from LocalDb
 * 
 * @author Waqar Alamgir <http://waqaralamgir.tk>
 */
LocalDb.prototype.del = function(key)
{
	var that = this;
	
	/* If it is supported */
	if(that._isSupported == 1)
	{
		try
		{
			localStorage.removeItem(key);
			return 1;
		}
		catch(e)
		{
			return 0;
		}
	}
	return 0;
};

/**
 * Clear LocalDb
 * 
 * @author Waqar Alamgir <http://waqaralamgir.tk>
 */
LocalDb.prototype.clear = function()
{
	var that = this;
	
	/* If it is supported */
	if(that._isSupported == 1)
	{
		/* Try clearing it */
		try
		{
			localStorage.clear();
			return 1;
		}
		catch(e)
		{
			return 0;
		}
	}
	return 0;
};