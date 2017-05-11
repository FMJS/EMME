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
      var x = new Int8Array(data.x_sab); x[1] = 1;
      var x = new Int8Array(data.x_sab); x[0] = 2;
      var x = new Int8Array(data.x_sab); x[1] = 2;
      $262.agent.report(report);
      $262.agent.leaving();
   })
   `);

// Thread t2
$262.agent.start(
   `$262.agent.receiveBroadcast(function (data) {
      var report = [];
      var x = new Int8Array(data.x_sab); id6_R_t2 = x[0]; report.push("id6_R_t2: "+id6_R_t2);
      if(id6_R_t2 >= 1) {
         var x = new Int8Array(data.x_sab); id7_R_t2 = x[0]; report.push("id7_R_t2: "+id7_R_t2);
      } else {
         var x = new Int8Array(data.x_sab); id8_R_t2 = x[1]; report.push("id8_R_t2: "+id8_R_t2);
      }
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
outputs[0] = "id6_R_t2: 0;id8_R_t2: 0";
outputs[1] = "id6_R_t2: 0;id8_R_t2: 1";
outputs[2] = "id6_R_t2: 0;id8_R_t2: 2";
outputs[3] = "id6_R_t2: 1;id7_R_t2: 0";
outputs[4] = "id6_R_t2: 2;id7_R_t2: 0";
outputs[5] = "id6_R_t2: 1;id7_R_t2: 1";
outputs[6] = "id6_R_t2: 2;id7_R_t2: 1";
outputs[7] = "id6_R_t2: 1;id7_R_t2: 2";
outputs[8] = "id6_R_t2: 2;id7_R_t2: 2";
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrtljtrwzAUhff+Co0JBBS9rNKSIaE1HfqApCWjKXUHQxN3cKbS/17bslPFXGHHVkiGu4njc+3rK30c
//UZrusu9dRilJ4iBaRhm/IdPbJL6u15Ru0vjzKzc8LMiM/IySmEfrKGOTvEKUq/GEHKgSVJWlCtArQK8E
//VdNroZpOjcpyx+Y92RY6t9y2Lhy6dOjKoQeO71b9/JL58x15esGZdZ9Z4+8DULW9AvQK0CtBrwS9CvSq
//ptfs8XIRlpt8MOH67/LKaVE9qosaD1n9krA6KOAr4GpTuVoXlWZdjvUj3cazcP64uh9f0Ta+GfKNfCPf
//fvnej7MH3VWtD7Y5so1sI9t+2VYD2FbD2GY52/rC7+XnOpH/w9eOc6ovlu1zzYy3EBi0Egiz1nkvGl1o
//sAsNdqHBLnQr2/v51mRrGHsn2/YG6ePu5K/LNxfaHNFGtBHtQWjLoWjLk6BtpzZDtBFtRNtnaluPjsxs
//3n4b75jYiDVijVh7TewuWMsTYG2nNUesEWvE2mday95pLb2lNWKNWCPWXtNa9k7rrlj/AZQsLqE=
