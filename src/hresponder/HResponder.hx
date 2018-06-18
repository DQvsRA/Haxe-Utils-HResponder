package hresponder;

/**
 * Created by Vladimir Minkin on 18/06/18.
 * License: MIT
 */
class HResponder
{
	private static var INDEX:Int = 0;

	private static var CORE:HResponderCore = new HResponderCore();

	/**
	 * The number of times that this item will respond.
	 * Default is 0 that means infinity times.
	 */
	public var replies:Int;


	//**************************************************
	//  Protected / Private Properties
	//**************************************************

	/**
	 * The HResponder Action associated with this HResponder.
	 *
	 * @private
	 */
	private var _action:String;

	/**
	* The closure method that this item was associated.
	*
	* @private
	*/
	private var _listener:Dynamic->Void;

	/**
	 * An unique hash.
	 *
	 * @private
	 */
	private var _hash:Int;

	public function new(action:String, listener:Dynamic->Void, replies:Int)
	{
		_action = action;
		_listener = listener;
		this.replies = replies;

		_hash = ++INDEX << 0x08;

		CORE.register(this);
	}

	//**********************************************************************************************************
	//
	//  Public Methods
	//
	//**********************************************************************************************************
	public static function add(action:String, listener:Dynamic->Void, replies:Int=0):HResponder
	{
		return new HResponder(action, listener, replies);
	}

	public static function dispatch(action:String, args:Dynamic = null):Bool
	{
		return CORE.dispatch(action, args);
	}

	public static function remove(action:String):Bool
	{
		return CORE.remove(action);
	}

	//**********************************************************************************************************
	//
	//  Public Methods
	//
	//**********************************************************************************************************
	public function perform(params:Dynamic = null):Void
	{
		// Call a listener in this HResponder.
		if (params != null) _listener(params)
		else _listener(null);
	}

	//**********************************************************************************************************
	//
	//  Getters / Setters
	//
	//**********************************************************************************************************

	/**
	 * [read-only] The HResponder Action associated with this HResponder.
	 */
	public var action(get, never):String;
	public function get_action():String {
		return _action;
	}

	/**
	 * [read-only] The listener defined to this HResponder.
	 */
	public var listener(get, never):Dynamic->Void;
	public function get_listener():Dynamic->Void {
		return _listener;
	}

	/**
	 * [read-only] [internal use] Unique identification for this instance based on its attributes.
	 */
	public var hash(get, never):Int;
	public function get_hash():Int {
		return _hash;
	}
}
