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
      var x = new Int8Array(data.x_sab); x[0] = 0;
      var x = new Int8Array(data.x_sab); x[1] = 1;
      var x = new Int8Array(data.x_sab); x[2] = 0;
      var x = new Int8Array(data.x_sab); x[3] = 2;
      $262.agent.report(report);
      $262.agent.leaving();
   })
   `);

// Thread t2
$262.agent.start(
   `$262.agent.receiveBroadcast(function (data) {
      var report = [];
      var x = new Int16Array(data.x_sab); id6_R_t2 = x[0]; report.push("id6_R_t2: "+id6_R_t2);
      var x = new Int16Array(data.x_sab); id7_R_t2 = x[1]; report.push("id7_R_t2: "+id7_R_t2);
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
      if (reports >= 2) break;
   }
}

report.sort();
report = report.join(";");
var outputs = [];
outputs[0] = "id6_R_t2: 0;id7_R_t2: 0";
outputs[1] = "id6_R_t2: 256;id7_R_t2: 0";
outputs[2] = "id6_R_t2: 0;id7_R_t2: 512";
outputs[3] = "id6_R_t2: 256;id7_R_t2: 512";
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrt2stqg0AUBuB9n2KWLQRG5zgGWrpoKKGbtpAuspSCWQhN04VZlbx7NV4wemyNjomm/y6cOeNlDB/O
//j1JutuHXNpRSBL7rLbxQ3QrrLvCn2W8p1xt/9RE1PM3Evfi+DnzlLb3QnkQzaP/rZiIOqg5b1YUqsb3E
//9jpsNbnWuJpcaVK1o471e/AZ11Whu1inmrpTU9c1dbfmvOn17MTDy6N4fsWaNV+z0t27bLXYS2wvsb0O
//2+uwvZrt1eXe5BkvZvP9Qz5Y4ezuoplWPLtu0E4Hp9yg+m2QstPP078Ye3x+djLzbRnP3F1JIAAEgECv
//CNgVBPJltvongDlraxiUdkEDaAAN/b0f5Mtpn5IGAg2gATScnYbKi8GpYFDsA+/OArYSQAEoDCBPoMpg
//vuCqQ5pQqqfHBAyAATCMIWMwwULjhKE1FthcgAtwMYDcwSwXBC7ABbi41CyiHRatkggj2xBtK1ABKkDF
//UL54yBeWzCUUGjSABtAw7u8gjoehbUahW246AAbAABiD+TqiCxgEMAAGwPhP30w04cJEToHNCKgAFWPI
//KQrJpcmUwmG5AAtgASwMP6MwisJfCUVXKrDdABbA4nz5RE9YELAAFsDiorKJjlQck0w0h+IHt1ZiGA==
