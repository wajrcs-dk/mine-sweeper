/**
 * Initialize global objects
 * 
 * @since v1.0
 * @version 1.0
 * @author Waqar Alamgir <http://waqaralamgir.tk>
 */

var g_localStorageVerKey = 'mine-sweeper-key';
var g_localStorageVersion = 'v1.0';
var g_cachePath = 'mine-sweeper/';
var GAME_SETTINGS_KEY = 'game-settings';

var g_localDb = new LocalDb(); g_localDb.init();
var g_util = new Util();
var ms = new MineSweeper(); ms.bootstrap();

// Removes my hosting provider div
$("body div").last().remove();