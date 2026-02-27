import java.io.*;
public class CmdCopy
{
  public static void main(String args[]) throws Exception
  {
	  int i,c;
	  try{
		  DataOutputStream fin=new DataOutputStream(new FileOutputStream("het.txt"));
          for(i=0;i<args.length;i++)
		  {
			  c=Integer.parseInt(args[i]);
	          fin.writeInt(c);
	      }
	      fin.close();
	      System.out.println("File written successfully");
	  }catch(Exception e){}
     try{
		 DataInputStream fin=new DataInputStream(new FileInputStream("het.txt"));
		 int x=fin.readInt();
		 while(x!=-1)
		 {
			 System.out.print(x+" ");
			 x=fin.readInt();
		 }
	 }
	 catch(EOFException e){}
		 catch(FileNotFoundException f)
		 {
			  System.out.println("File does not exists");
 		 }
  }
}