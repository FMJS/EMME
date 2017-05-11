// Copyright 2017 Cristian Mattarei
//
// Licensed under the modified BSD (3-clause BSD) License.
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.


// Thread t1
$262.agent.start(
   `$262.agent.receiveBroadcast(function (data) {
      var report = [];
      var x = new Int8Array(data.x_sab); id2_R_t1 = x[0]; report.push("id2_R_t1: "+id2_R_t1);
      $262.agent.report(report);
      $262.agent.leaving();
   })
   `);

// Thread t2
$262.agent.start(
   `$262.agent.receiveBroadcast(function (data) {
      var report = [];
      var x = new Int8Array(data.x_sab); id3_R_t2 = x[0]; report.push("id3_R_t2: "+id3_R_t2);
      $262.agent.report(report);
      $262.agent.leaving();
   })
   `);

// Thread t3
$262.agent.start(
   `$262.agent.receiveBroadcast(function (data) {
      var report = [];
      var x = new Int8Array(data.x_sab); id4_R_t3 = x[0]; report.push("id4_R_t3: "+id4_R_t3);
      $262.agent.report(report);
      $262.agent.leaving();
   })
   `);

// Thread t4
$262.agent.start(
   `$262.agent.receiveBroadcast(function (data) {
      var report = [];
      var x = new Int8Array(data.x_sab); id5_R_t4 = x[0]; report.push("id5_R_t4: "+id5_R_t4);
      $262.agent.report(report);
      $262.agent.leaving();
   })
   `);

// Thread t5
$262.agent.start(
   `$262.agent.receiveBroadcast(function (data) {
      var report = [];
      var x = new Int8Array(data.x_sab); x[0] = 1;
      var x = new Int8Array(data.x_sab); x[0] = 2;
      $262.agent.report(report);
      $262.agent.leaving();
   })
   `);

var data = {
   x_sab : new SharedArrayBuffer(8),
}
$262.agent.broadcast(data);
var report = [];

// MAIN Thread

var thread_report;
var reports = 0;
var i = 0;
while (true) {
   thread_report = $262.agent.getReport();
   if (thread_report != null) {
      for(i=0; i < thread_report.length; i++){
         report.push(thread_report[i]);
         print(thread_report[i]);
      }
      reports += 1;
      if (reports >= 5) break;
   }
}

report.sort();
report = report.join(";");
var outputs = [];
outputs[0] = "id2_R_t1: 0;id3_R_t2: 0;id4_R_t3: 0;id5_R_t4: 0";
outputs[1] = "id2_R_t1: 1;id3_R_t2: 0;id4_R_t3: 0;id5_R_t4: 0";
outputs[2] = "id2_R_t1: 2;id3_R_t2: 0;id4_R_t3: 0;id5_R_t4: 0";
outputs[3] = "id2_R_t1: 0;id3_R_t2: 1;id4_R_t3: 0;id5_R_t4: 0";
outputs[4] = "id2_R_t1: 1;id3_R_t2: 1;id4_R_t3: 0;id5_R_t4: 0";
outputs[5] = "id2_R_t1: 2;id3_R_t2: 1;id4_R_t3: 0;id5_R_t4: 0";
outputs[6] = "id2_R_t1: 0;id3_R_t2: 2;id4_R_t3: 0;id5_R_t4: 0";
outputs[7] = "id2_R_t1: 1;id3_R_t2: 2;id4_R_t3: 0;id5_R_t4: 0";
outputs[8] = "id2_R_t1: 2;id3_R_t2: 2;id4_R_t3: 0;id5_R_t4: 0";
outputs[9] = "id2_R_t1: 0;id3_R_t2: 0;id4_R_t3: 1;id5_R_t4: 0";
outputs[10] = "id2_R_t1: 1;id3_R_t2: 0;id4_R_t3: 1;id5_R_t4: 0";
outputs[11] = "id2_R_t1: 2;id3_R_t2: 0;id4_R_t3: 1;id5_R_t4: 0";
outputs[12] = "id2_R_t1: 0;id3_R_t2: 1;id4_R_t3: 1;id5_R_t4: 0";
outputs[13] = "id2_R_t1: 1;id3_R_t2: 1;id4_R_t3: 1;id5_R_t4: 0";
outputs[14] = "id2_R_t1: 2;id3_R_t2: 1;id4_R_t3: 1;id5_R_t4: 0";
outputs[15] = "id2_R_t1: 0;id3_R_t2: 2;id4_R_t3: 1;id5_R_t4: 0";
outputs[16] = "id2_R_t1: 1;id3_R_t2: 2;id4_R_t3: 1;id5_R_t4: 0";
outputs[17] = "id2_R_t1: 2;id3_R_t2: 2;id4_R_t3: 1;id5_R_t4: 0";
outputs[18] = "id2_R_t1: 0;id3_R_t2: 0;id4_R_t3: 2;id5_R_t4: 0";
outputs[19] = "id2_R_t1: 1;id3_R_t2: 0;id4_R_t3: 2;id5_R_t4: 0";
outputs[20] = "id2_R_t1: 2;id3_R_t2: 0;id4_R_t3: 2;id5_R_t4: 0";
outputs[21] = "id2_R_t1: 0;id3_R_t2: 1;id4_R_t3: 2;id5_R_t4: 0";
outputs[22] = "id2_R_t1: 1;id3_R_t2: 1;id4_R_t3: 2;id5_R_t4: 0";
outputs[23] = "id2_R_t1: 2;id3_R_t2: 1;id4_R_t3: 2;id5_R_t4: 0";
outputs[24] = "id2_R_t1: 0;id3_R_t2: 2;id4_R_t3: 2;id5_R_t4: 0";
outputs[25] = "id2_R_t1: 1;id3_R_t2: 2;id4_R_t3: 2;id5_R_t4: 0";
outputs[26] = "id2_R_t1: 2;id3_R_t2: 2;id4_R_t3: 2;id5_R_t4: 0";
outputs[27] = "id2_R_t1: 0;id3_R_t2: 0;id4_R_t3: 0;id5_R_t4: 1";
outputs[28] = "id2_R_t1: 1;id3_R_t2: 0;id4_R_t3: 0;id5_R_t4: 1";
outputs[29] = "id2_R_t1: 2;id3_R_t2: 0;id4_R_t3: 0;id5_R_t4: 1";
outputs[30] = "id2_R_t1: 0;id3_R_t2: 1;id4_R_t3: 0;id5_R_t4: 1";
outputs[31] = "id2_R_t1: 1;id3_R_t2: 1;id4_R_t3: 0;id5_R_t4: 1";
outputs[32] = "id2_R_t1: 2;id3_R_t2: 1;id4_R_t3: 0;id5_R_t4: 1";
outputs[33] = "id2_R_t1: 0;id3_R_t2: 2;id4_R_t3: 0;id5_R_t4: 1";
outputs[34] = "id2_R_t1: 1;id3_R_t2: 2;id4_R_t3: 0;id5_R_t4: 1";
outputs[35] = "id2_R_t1: 2;id3_R_t2: 2;id4_R_t3: 0;id5_R_t4: 1";
outputs[36] = "id2_R_t1: 0;id3_R_t2: 0;id4_R_t3: 1;id5_R_t4: 1";
outputs[37] = "id2_R_t1: 1;id3_R_t2: 0;id4_R_t3: 1;id5_R_t4: 1";
outputs[38] = "id2_R_t1: 2;id3_R_t2: 0;id4_R_t3: 1;id5_R_t4: 1";
outputs[39] = "id2_R_t1: 0;id3_R_t2: 1;id4_R_t3: 1;id5_R_t4: 1";
outputs[40] = "id2_R_t1: 1;id3_R_t2: 1;id4_R_t3: 1;id5_R_t4: 1";
outputs[41] = "id2_R_t1: 2;id3_R_t2: 1;id4_R_t3: 1;id5_R_t4: 1";
outputs[42] = "id2_R_t1: 0;id3_R_t2: 2;id4_R_t3: 1;id5_R_t4: 1";
outputs[43] = "id2_R_t1: 1;id3_R_t2: 2;id4_R_t3: 1;id5_R_t4: 1";
outputs[44] = "id2_R_t1: 2;id3_R_t2: 2;id4_R_t3: 1;id5_R_t4: 1";
outputs[45] = "id2_R_t1: 0;id3_R_t2: 0;id4_R_t3: 2;id5_R_t4: 1";
outputs[46] = "id2_R_t1: 1;id3_R_t2: 0;id4_R_t3: 2;id5_R_t4: 1";
outputs[47] = "id2_R_t1: 2;id3_R_t2: 0;id4_R_t3: 2;id5_R_t4: 1";
outputs[48] = "id2_R_t1: 0;id3_R_t2: 1;id4_R_t3: 2;id5_R_t4: 1";
outputs[49] = "id2_R_t1: 1;id3_R_t2: 1;id4_R_t3: 2;id5_R_t4: 1";
outputs[50] = "id2_R_t1: 2;id3_R_t2: 1;id4_R_t3: 2;id5_R_t4: 1";
outputs[51] = "id2_R_t1: 0;id3_R_t2: 2;id4_R_t3: 2;id5_R_t4: 1";
outputs[52] = "id2_R_t1: 1;id3_R_t2: 2;id4_R_t3: 2;id5_R_t4: 1";
outputs[53] = "id2_R_t1: 2;id3_R_t2: 2;id4_R_t3: 2;id5_R_t4: 1";
outputs[54] = "id2_R_t1: 0;id3_R_t2: 0;id4_R_t3: 0;id5_R_t4: 2";
outputs[55] = "id2_R_t1: 1;id3_R_t2: 0;id4_R_t3: 0;id5_R_t4: 2";
outputs[56] = "id2_R_t1: 2;id3_R_t2: 0;id4_R_t3: 0;id5_R_t4: 2";
outputs[57] = "id2_R_t1: 0;id3_R_t2: 1;id4_R_t3: 0;id5_R_t4: 2";
outputs[58] = "id2_R_t1: 1;id3_R_t2: 1;id4_R_t3: 0;id5_R_t4: 2";
outputs[59] = "id2_R_t1: 2;id3_R_t2: 1;id4_R_t3: 0;id5_R_t4: 2";
outputs[60] = "id2_R_t1: 0;id3_R_t2: 2;id4_R_t3: 0;id5_R_t4: 2";
outputs[61] = "id2_R_t1: 1;id3_R_t2: 2;id4_R_t3: 0;id5_R_t4: 2";
outputs[62] = "id2_R_t1: 2;id3_R_t2: 2;id4_R_t3: 0;id5_R_t4: 2";
outputs[63] = "id2_R_t1: 0;id3_R_t2: 0;id4_R_t3: 1;id5_R_t4: 2";
outputs[64] = "id2_R_t1: 1;id3_R_t2: 0;id4_R_t3: 1;id5_R_t4: 2";
outputs[65] = "id2_R_t1: 2;id3_R_t2: 0;id4_R_t3: 1;id5_R_t4: 2";
outputs[66] = "id2_R_t1: 0;id3_R_t2: 1;id4_R_t3: 1;id5_R_t4: 2";
outputs[67] = "id2_R_t1: 1;id3_R_t2: 1;id4_R_t3: 1;id5_R_t4: 2";
outputs[68] = "id2_R_t1: 2;id3_R_t2: 1;id4_R_t3: 1;id5_R_t4: 2";
outputs[69] = "id2_R_t1: 0;id3_R_t2: 2;id4_R_t3: 1;id5_R_t4: 2";
outputs[70] = "id2_R_t1: 1;id3_R_t2: 2;id4_R_t3: 1;id5_R_t4: 2";
outputs[71] = "id2_R_t1: 2;id3_R_t2: 2;id4_R_t3: 1;id5_R_t4: 2";
outputs[72] = "id2_R_t1: 0;id3_R_t2: 0;id4_R_t3: 2;id5_R_t4: 2";
outputs[73] = "id2_R_t1: 1;id3_R_t2: 0;id4_R_t3: 2;id5_R_t4: 2";
outputs[74] = "id2_R_t1: 2;id3_R_t2: 0;id4_R_t3: 2;id5_R_t4: 2";
outputs[75] = "id2_R_t1: 0;id3_R_t2: 1;id4_R_t3: 2;id5_R_t4: 2";
outputs[76] = "id2_R_t1: 1;id3_R_t2: 1;id4_R_t3: 2;id5_R_t4: 2";
outputs[77] = "id2_R_t1: 2;id3_R_t2: 1;id4_R_t3: 2;id5_R_t4: 2";
outputs[78] = "id2_R_t1: 0;id3_R_t2: 2;id4_R_t3: 2;id5_R_t4: 2";
outputs[79] = "id2_R_t1: 1;id3_R_t2: 2;id4_R_t3: 2;id5_R_t4: 2";
outputs[80] = "id2_R_t1: 2;id3_R_t2: 2;id4_R_t3: 2;id5_R_t4: 2";
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrt3UFrE1EYheG9vyJLhUKa23YOKC4sUtyoUBddBiEuAta6SFfS/27SqZ1JMiNT554v2PvuwrSZm1Qf
//eqCHnOn05nb183Y1nU6WizS/nK9mryfHb5aLk83jVD8+3Tw+qR+fbR6frh9Pp9c3i2/f10/8cD55O/n1
//crmo5lfz1dnR+k66f/TqaLK+Ols/vv66/HH0eML+9fq0/ev1yfvX61exf73qOffh9dxN3n16P/n4+X95
//vffX69ewe2pztX1mc7V9YnO16rxv+7T6jN37Nlfb922uVp13aN+3vtvuHZqrVef3tu9QP2/3e5urW//G
//l+cX9//IW+/zz094/czjzbO3XmzHF5vX0fHF5uCtLz4cf/HwX6zz8L5z+47sPq0+6cvV5qS7F9MuyDMg
//A/kZQn58Xjzj7h+QE3ECMYifIWIdDrHCEbcj9QzEIC4hUu/9mg4J1N1vO3ecBjGIC4jTXsLdPx4f4ARg
//AJcVpb2AFQy4HaMTgAFcQozWQWK0QmI0iEFcQIzWAWK0QmI0gAFcQIzWAWK0QmJ0+09KMwADuMiCx97v
//bne9o/st5ih3gBjEJZY7RhN+WrVjPOAEYABT7MgHWMGA+0odAAZwiaUOW4juftN5IzSAAVx2ocMUoF14
//E3jBS5nDG55dePuKHOAFb4lFDlt0VkB0BjCAyy5xmKKzAqIzeMFbdoHDFJ0VEJ3bfzZK4AVvkeUNRZc3
//ZCtvgBjEJZY3FFvekK28AWAAl1jeUGx5Q7byBoABXGJ5Q7HlDdnKGwAGcHnlDUWWN2Qrb4AXvOWVNxRZ
//3pCtvAFe8JZY3lBseUO28gaAAVxeeUOR5Q3ZyhvgBW955Q1FljdkK2+0PzpnBl7wMq2y8wvdPqxStd/k
//6FkVEIOYWZWBhPOMqgwHnAAMYMob+QArGPCQORUAA5g5lZEh+mkf5f5vERrAAGZKxRCgXXgTeMFLecMb
//nl14h0yogBe8TKiMjM4KiM4ABjDzKYborIDoDF7wMp1iiM4KiM59H9gOXvAym2KqblR/e9uZJlMADGAm
//Uwy1jbF4E3jBS2kjF16F4h0ylQJe8DKVYqhr5IzN4AUvMynZQ7MHbgIucClqOAOzB+6QeRTgApd5FENF
//I2dcBi94mUbJHpdlj8vABS6zKNnjsuxxue/D2IELXCZRTMUMmYoZAAYwcyjmYoZMxQzwgpcpFHMxQ6Zi
//BnjBywyKuZghUzEDvOBlAsVYzJCpmAFc4DJ/YixmyFTMAC5wmT4xFzNkKmaAF7zMnhiLGTIVM4ALXCZP
//jMUMmYoZ7Y+7ScAFLnMnO7LtcyfKOncCYhAzdzKQcJ65E2WdOwEwgJk7GQhYwYCHzJ0AGMDMnYwM0U/7
//0HVlnTsBMICZOxkRoF14E3jBS1nDG55deIfMnYAXvMydjIzOCojOAAYwcyeG6KyA6Axe8DJ3YojOCojO
//fR+4Dl7wMndiqm4MeIOj504ADGDmTgy1jbF4E3jBS2kjF16F4h0ydwJe8DJ3Yqhr5IzN4AUvcyfZQ7MH
//bgIucClqOAOzB+6QuRPgApe5E0NFI2dcBi94mTvJHpdlj8vABS5zJ9njsuxxue8D14ELXOZOTMUMmYoZ
//AAYwcyfmYoZMxQzwgpe5E3MxQ6ZiBnjBy9yJuZghUzEDvOBl7sRYzJCpmAFc4DJ3YixmyFTMAC5wmTsx
//FzNkKmaAF7zMnRiLGTIVM4ALXOZOjMWM4XB/A/dC6Dc=
