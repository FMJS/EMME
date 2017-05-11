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
      var x = new Int8Array(data.x_sab); x[0] = 3;
      var x = new Int8Array(data.x_sab); x[1] = 1;
      var x = new Int8Array(data.x_sab); x[2] = 2;
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
outputs[1] = "id6_R_t2: 3;id7_R_t2: 0";
outputs[2] = "id6_R_t2: 256;id7_R_t2: 0";
outputs[3] = "id6_R_t2: 259;id7_R_t2: 0";
outputs[4] = "id6_R_t2: 0;id7_R_t2: 2";
outputs[5] = "id6_R_t2: 3;id7_R_t2: 2";
outputs[6] = "id6_R_t2: 256;id7_R_t2: 2";
outputs[7] = "id6_R_t2: 259;id7_R_t2: 2";
outputs[8] = "id6_R_t2: 0;id7_R_t2: 768";
outputs[9] = "id6_R_t2: 3;id7_R_t2: 768";
outputs[10] = "id6_R_t2: 256;id7_R_t2: 768";
outputs[11] = "id6_R_t2: 259;id7_R_t2: 768";
outputs[12] = "id6_R_t2: 0;id7_R_t2: 770";
outputs[13] = "id6_R_t2: 3;id7_R_t2: 770";
outputs[14] = "id6_R_t2: 256;id7_R_t2: 770";
outputs[15] = "id6_R_t2: 259;id7_R_t2: 770";
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrt2stOg0AUBuC9TzFLTZpMmcOAaFzYmMaNmtSFS2KCCxJrXdCV6bsLhRJKD0qH4bL4d+TMGS4D+UL+
//jJSbbfK9TaQUceSFqzBRN2J+G0f+4VjK9Sb6+EwbHhfiTvxcxpEK38LEmaUzaH90NRNHVZet6kqV2F5i
//e122mt9rVs3vNK86acf6Pf7K6qrSXa1TQ91tqOuGutdw3eJ+duL++UE8vWDN2q9Z7ek9tlrtJbaX2F6X
//7XXZXs326npv/o5Xi+X+JR+t8OHp0pnzbHbToFMM+tyg+muQDpdfFp8Ye35+dj7z9S2bubuQHAIEBIAA
//ELCFgHOCQLnM8/4JYK5qDIPSHmgADaChv/+DcjmdIWkgCzQEoAE0gIZONJz8GAwFg2JfeHcWqnmCAgpA
//ASiMkyfQyWC54KpDmlCrF+c8M2MADIABMIySMdhgoXXCYIzFce4ALsAFuBgld7DLBfXGRQAuwAW4GDeL
//MMPCKIkwpqKaT/jeNagAFaBiKjseyoUlewmFNkooQANoAA2T2QdxPgymGYU2zCgABsAAGJPZHdEFDOoN
//jABgAAyAMb09E224sJFTaLOcwsf2KlABKobMKSrJpc2UwmW5MMwowAJYAAsDZhRWUfgvoehKRS2fABbA
//AlgMmE/0hAX1hEUALIAFsBglm+hIxTnJRHsofgGcS2KE
