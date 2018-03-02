package scopeCalendar.services;

import java.util.Comparator;

import scopeCalendar.models.Event;

public class EventTimeComparer implements Comparator<Event> {

	@Override
	public int compare(Event x, Event y) {
	    int startComparison = compare(x.getStartDate().getMillis(), y.getStartDate().getMillis());
	    return startComparison != 0 ?
	    		startComparison : compare(x.getEndDate().getMillis(), y.getEndDate().getMillis());
	}
	
	private static int compare(long a, long b) {
	    return a < b ? -1
	         : a > b ? 1
	         : 0;
	}
}