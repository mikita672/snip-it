import java.time.LocalTime;

public class Test {
    public static void main(String[] args) {
        LocalTime slot = LocalTime.parse("10:00");
        int durationMinutes = 210;
        LocalTime slotEnd = slot.plusMinutes(durationMinutes);

        LocalTime resStart = LocalTime.parse("10:00");
        int rDuration = 210;
        int SLOT_INTERVAL_MINUTES = 30;
        int slots = (int) Math.ceil((double) rDuration / SLOT_INTERVAL_MINUTES);
        LocalTime resEnd = resStart.plusMinutes(slots * SLOT_INTERVAL_MINUTES);

        boolean blocked = slot.isBefore(resEnd) && slotEnd.isAfter(resStart);
        System.out.println("Blocked: " + blocked);
    }
}
