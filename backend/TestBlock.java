import java.time.LocalTime;
import java.util.List;

public class TestBlock {
    public static void main(String[] args) {
        LocalTime slot = LocalTime.of(10, 0);
        int durationMinutes = 210;
        
        LocalTime resStart = LocalTime.of(10, 0);
        int rDuration = 210;
        
        LocalTime slotEnd = slot.plusMinutes(durationMinutes);
        LocalTime resEnd = resStart.plusMinutes(rDuration);
        
        boolean blocked = slot.isBefore(resEnd) && slotEnd.isAfter(resStart);
        System.out.println("Blocked? " + blocked);
    }
}
