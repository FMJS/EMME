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
      var x = new Int8Array(data.x_sab); x[0] = 2;
      var x = new Int8Array(data.x_sab); x[1] = 2;
      var x = new Int8Array(data.x_sab); x[2] = 3;
      var x = new Int8Array(data.x_sab); x[3] = 0;
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
outputs[1] = "id6_R_t2: 2;id7_R_t2: 0";
outputs[2] = "id6_R_t2: 512;id7_R_t2: 0";
outputs[3] = "id6_R_t2: 514;id7_R_t2: 0";
outputs[4] = "id6_R_t2: 0;id7_R_t2: 3";
outputs[5] = "id6_R_t2: 2;id7_R_t2: 3";
outputs[6] = "id6_R_t2: 512;id7_R_t2: 3";
outputs[7] = "id6_R_t2: 514;id7_R_t2: 3";
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrt2k1Lw0AQBuC7v2KPCoVtdnZTUDxYpHhRoR56DEI8BKz1kJ6k/92k+SBNJppuNk0O763MzjbJpjyU
//l5Fyt4+/97GUIgr9YB3E6lbM76JwUXyWcrsLPz6ThqeluBc/11Gogk0Qe7NkBx0/3czESVWzVVOpEttL
//bK9mq9m9ptXsTrOql3Rs36OvtK4q3dU6tdR1S9201P2W6+b3cxAPL4/i+RVn1v3Mak/vs9VqL7G9xPZq
//tlezvYbtNfXe7B2vl6vjSz454eLpkp3zdHfbopcvLrhF9dciFZdf5T8x9vv53dnOt02683AlOQQUEAAC
//QMAVAl4DgfKY58MTwFzVGgbjgQbQABoG/H9QHqd3SRrIAQ0aNIAG0NCLhsYfg0vBoNgX3p+Fap5AQAEo
//AIVx8gRqLJYHrnqkCbV6/p1nZgyAATAAhlEyBhcsdE4YrLE4zR3ABbgAF6PkDm65oMG40OACXICLcbMI
//OyyskghrKjDvACgAxSTnHcqDJXf5hLHKJwADYAAME5mBOJ8F23zCWOYT4AJcgIuJzEX04YIG4wKzEuAC
//XExuVqILFi7yCWOVTyDIBBSA4pL5RCWvdJlOaBYLg9kJoAAUJp5NOCXhv2SiLxSYmwAVoGKsXGIgKmgg
//KjAzASpAxRiZRE8ozkkkujPxC96SXtg=
