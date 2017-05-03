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
      var x = new Int8Array(data.x_sab); x[0] = 1;
      var x = new Int8Array(data.x_sab); x[1] = 3;
      var x = new Int8Array(data.x_sab); x[2] = 3;
      var x = new Int8Array(data.x_sab); x[3] = 3;
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
outputs[1] = "id6_R_t2: 1;id7_R_t2: 0";
outputs[2] = "id6_R_t2: 768;id7_R_t2: 0";
outputs[3] = "id6_R_t2: 769;id7_R_t2: 0";
outputs[4] = "id6_R_t2: 0;id7_R_t2: 3";
outputs[5] = "id6_R_t2: 1;id7_R_t2: 3";
outputs[6] = "id6_R_t2: 768;id7_R_t2: 3";
outputs[7] = "id6_R_t2: 769;id7_R_t2: 3";
outputs[8] = "id6_R_t2: 0;id7_R_t2: 768";
outputs[9] = "id6_R_t2: 1;id7_R_t2: 768";
outputs[10] = "id6_R_t2: 768;id7_R_t2: 768";
outputs[11] = "id6_R_t2: 769;id7_R_t2: 768";
outputs[12] = "id6_R_t2: 0;id7_R_t2: 771";
outputs[13] = "id6_R_t2: 1;id7_R_t2: 771";
outputs[14] = "id6_R_t2: 768;id7_R_t2: 771";
outputs[15] = "id6_R_t2: 769;id7_R_t2: 771";
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrt2stOg0AUBuC9TzFLTZpM4TAgGhc2pnGjJnXhkpjggsRaF3Rl+u5CoWRKD0qH4bL4d+TMGS4D+UL+
//jJSbbfq9TaUUSexHqyh1b8T8NomDw7GU60388Zk1PC7Enfi5TGI3eotSZ5bNoP3R1UwcVT22qrQqsb3E
//9npstbjXvFrcaVF1so71e/KV112tW69TQ91rqKuGut9w3fJ+duL++UE8vWDN2q9Z7el9tqr3EttLbK/H
//9npsr2J7Vb23eMerxXL/ko9W+PB02cx5Prtp0CkHA27Q/WuQDpdflp8Ye35+djHz9S2fubuQHAIOEAAC
//QMAWAs4JAtUyz/sngLmqMQyBfw0aQANo6O//oFpOZ0gayAINIWgADaChEw0nPwZDweCyL7w7C3qeQEAB
//KACFcfIEOhmsFtztkCbU6uU5z8wYAANgAAyjZAw2WGidMBhjcZw7gAtwAS5GyR3sckG9cRGCC3ABLsbN
//IsywMEoijKnQ84nsLwNUgApQMZUdD9XCkr2EQhklFKABNICGyeyDOB8G04xCGWYUAANgAIzJ7I7oAgb1
//BkYIMAAGwJjenok2XNjIKZRZThE4oAJUgIoBcwotubSZUngsF4YZBVgAC2BhwIzCKgr/JRRdqajlE8AC
//WACLAfOJnrCgnrAIgQWwABajZBMdqTgnmWgPxS8mEGK8
