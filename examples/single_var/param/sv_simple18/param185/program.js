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
      var x = new Int8Array(data.x_sab); x[1] = 3;
      var x = new Int8Array(data.x_sab); x[2] = 2;
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
outputs[2] = "id6_R_t2: 768;id7_R_t2: 0";
outputs[3] = "id6_R_t2: 770;id7_R_t2: 0";
outputs[4] = "id6_R_t2: 0;id7_R_t2: 2";
outputs[5] = "id6_R_t2: 2;id7_R_t2: 2";
outputs[6] = "id6_R_t2: 768;id7_R_t2: 2";
outputs[7] = "id6_R_t2: 770;id7_R_t2: 2";
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrt2rtqwzAUBuC9T6GxhYBiHcsuLR0aSujSFtIhoyk4g6FpOjhTybvXjh3jJMetI8mX4d/C0ZEvcviw
//fyTlZpt+b1MpRRIH0SJK1Z2Y3idxePgt5XoTrz6zhueZeBA/10msomWUepNsBu1/3UzEUdVnq7pWJbaX
//2F6frRbXmleLKy2qXtax/ki+8rqqddfr1FD3G+q6oR40nLe8np14fH0SL29Ys/ZrdnL3AVut9xLbS2yv
//z/b6bK9me/Vpb/GMF7P5/iEfrfDh7rKZ03x206BXDobcoPprkA6nn5d/Mfb4/Oxi5vsyn7m7khwCCggA
//ASDgCgHvDIFqmafdE8Cc1RiGMLgFDaABNHT3flAtp9cnDWRPQ4hPB9AAGuxoOHsx6AsGxT5wexbqKCig
//ABSAwjB5Ap0NVguuLNKEk3p5zAszBsAAGADDIBmDCxZaJwzGWBznDuACXICLQXIHt1xQV1yE+OwAF+Bi
//4CzCDAujJMKYCoSWgAJQjHK/Q7Ww5C6f0Eb5BGAADIBhJHsgLmfBNJ/QhvkEuAAX4GIk+yJsuKCuuMBe
//CXABLsa3V6INFi7yCW2UTyDIBBSAos98opZXukwnfBYLjb0TQAEojDybcErCf8mELRTYNwEqQMVQuURH
//VFA3VGDPBKgAFYNkEpZQXJJItGfiF5DWXxQ=
