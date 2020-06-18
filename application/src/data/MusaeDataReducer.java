import java.io.File;
import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.Scanner;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.*;
import java.util.Collection;
import java.util.function.Predicate;

public class MusaeDataReducer {
  public static Map<Integer, ArrayList<Integer>> idMap = new HashMap<>();
  public static int[] edgesHistogram = new int[40000];

  public static boolean isEssentialJSONContent(String str) {
    return str.contains("export") || str.contains("vertices") || str.contains("edges");
  }

  public static boolean stringContainsNumberName(String str) {
    Pattern p = Pattern.compile("(\\{.*\"(name)\": \"\\d.*\")");
    Matcher m = p.matcher(str);

    return m.find();
  }

  public static boolean stringContainsIDHigherThan10000(String str) {
    Pattern p = Pattern.compile("(\\{.*(id|source|target): \\d{4,5}.*)");
    Matcher m = p.matcher(str);

    return m.find();
  }

  public static void initializeIdMap(String str) {
    Pattern p = Pattern.compile("\"id\": (\\d{1,5}).*");
    Matcher m = p.matcher(str);

    while(m.find()) {
      System.out.println("Inside idmap init " + m.group(0));
      int id = Integer.parseInt(m.group(1));
      idMap.put(id, new ArrayList<>());
    }
  }

  public static void countEdges(String str) {
    Pattern p = Pattern.compile("\\{.*\"source\": (\\d{1,5}), \"target\": (\\d{1,5})");
    Matcher m = p.matcher(str);

    while(m.find()) {
      int sourceId = Integer.parseInt(m.group(1));
      int targetId = Integer.parseInt(m.group(2));

      idMap.get(targetId).add(sourceId);
      idMap.get(sourceId).add(targetId);

      edgesHistogram[targetId]++;
      edgesHistogram[sourceId]++;
    }
  }

  public static void main(String[] args) {
    BufferedReader reader = null;
    BufferedWriter writer = null;

    try {
      File musaeData = new File("./musae_git_data.json");
      File outputFile = new File("./musae_git_data-reduced.json");
      reader = new BufferedReader(new FileReader(musaeData));
      writer = new BufferedWriter(new FileWriter(outputFile));

      String currentLine;

      while ((currentLine = reader.readLine()) != null) {
        String trimmedLine = currentLine.trim();
        System.out.println(trimmedLine);
        initializeIdMap(trimmedLine);
        countEdges(trimmedLine);
        if (isEssentialJSONContent(trimmedLine)) {
          writer.write(currentLine + System.getProperty("line.separator"));
          continue;
        }
        if (stringContainsIDHigherThan10000(trimmedLine)) {
          continue;
        }
        if (stringContainsNumberName(trimmedLine)) {
          continue;
        }
        writer.write(currentLine + System.getProperty("line.separator"));
      }
      writer.close();
      reader.close();
      Predicate<ArrayList<Integer>> testIfEmpty = (ArrayList<Integer> edges) -> (edges.isEmpty());
      idMap.values().removeIf(testIfEmpty);
      ValueComparator comparator = new ValueComparator(idMap);
      TreeMap<Integer, ArrayList<Integer>> sorted_map = new TreeMap<Integer, ArrayList<Integer>>(comparator);
      sorted_map.putAll(idMap);
      System.out.println(sorted_map);
      System.out.println(Arrays.toString(edgesHistogram));
    } catch (Exception e) {
      System.out.println("Somehow, the files you ensured to be there are not available.");
      e.printStackTrace();
    }
  }
}

class ValueComparator implements Comparator<Integer> {
    Map<Integer, ArrayList<Integer>> base;

    public ValueComparator(Map<Integer, ArrayList<Integer>> base) {
        this.base = base;
    }

    // Note: this comparator imposes orderings that are inconsistent with
    // equals.
    public int compare(Integer a, Integer b) {
        if (base.get(a).size() >= base.get(b).size()) {
            return -1;
        } else {
            return 1;
        } // returning 0 would merge keys
    }
}
