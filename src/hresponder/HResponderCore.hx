package hresponder;

/**
 * Created by Vladimir Minkin on 18/06/18.
 * License: MIT
 */
class HResponderCore
{
	private var _responderByHash:Map<Int, HResponder> = new Map<Int, HResponder>();
	private var _hashsByAction:Map<String, Array<Int>> = new Map<String, Array<Int>>();

	public function new() {
	}

	public function register(responder:HResponder):Void
	{
		var hash:Int = responder.hash;
		var action:String = responder.action;

		_responderByHash.set(hash, responder);

		if (_hashsByAction.exists(action))
				_hashsByAction.get(action).push(hash);
		else    _hashsByAction.set(action, [hash]);
	}

	public function dispatch(action:String, args:Dynamic):Bool
	{
		var result:Bool = true;

		if (_hashsByAction.exists(action))
		{
			var responder:HResponder;
			var replies:Int;
			var hashes:Array<Int> = _hashsByAction.get(action);
			for (hash in hashes) {
				responder = _responderByHash.get(hash);
				replies = responder.replies;
				if (replies > 0)
				{
					if (--replies == 0 && RemoveResponder(responder)) result = false;
					responder.replies = replies;
				}
				responder.perform(args);
			}
		}
		return result;
	}

	public function remove(action:String):Bool
	{
		if (_hashsByAction.exists(action))
		{
			var hashes = _hashsByAction.get(action);
			for (hash in hashes) RemoveResponder(_responderByHash.get(hash));
			return true;
		}
		else return false;
	}

	/**
	* Exclude a HResponder based on an action.
	*
	* @param	The HResponder to remove.
	* @return   If there is no hashes (no HResponders) for that action stop future perform
	*/
	private function RemoveResponder(responder:HResponder):Bool {
		var hash:Int = responder.hash;
		var action:String = responder.action;

		var noMoreActions:Bool = false;

		// Remove HResponder by hash
		_responderByHash.remove(hash);

		// Remove hash for HResponder action
		var hashesForAction:Array<Int> = _hashsByAction.get(action);
		hashesForAction.remove(hash);

		if (hashesForAction.length == 0) {
			_hashsByAction.remove(action);
			noMoreActions = true;
		}

		return noMoreActions;
	}
}
