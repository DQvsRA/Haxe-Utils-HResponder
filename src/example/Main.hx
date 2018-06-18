package example;
import hresponder.HResponder;

/**
 * Created by Vladimir Minkin on 18/06/18.
 * License: MIT
 */
class Main
{
	static public function main():Void
	{
		var action1 = "ACTION";

		HResponder.add(action1, function(answer) {
			trace("> Action 1 -> Hello: " + answer);
		});

		HResponder.dispatch(action1, "World");
		HResponder.dispatch(action1, "Massive");
		HResponder.dispatch(action1, "Vladimir");

		HResponder.remove(action1);

		HResponder.add(action1, function(answer) {
			trace("> Action 1 (limit 1) -> Goodbye: " + answer);
		}, 1);

		HResponder.dispatch(action1, "World");
		HResponder.dispatch(action1, "Massive");
		HResponder.dispatch(action1, "Vladimir");

		var action2 = "ACTION";

		HResponder.add(action2, function(answer) {
			trace("> Action 2 -> I do: " + answer);
		});

		HResponder.dispatch(action2, "Code");
		HResponder.dispatch(action2, "Gym");
		HResponder.dispatch(action2, "Eat");
		HResponder.dispatch(action2, "Sleep (sometimes)");
	}
}
