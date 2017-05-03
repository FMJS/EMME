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
      $262.agent.report(report);
      $262.agent.leaving();
   })
   `);

// Thread t2
$262.agent.start(
   `$262.agent.receiveBroadcast(function (data) {
      var report = [];
      var x = new Int8Array(data.x_sab); x[1] = 2;
      var x = new Int8Array(data.x_sab); x[2] = 2;
      $262.agent.report(report);
      $262.agent.leaving();
   })
   `);

// Thread t3
$262.agent.start(
   `$262.agent.receiveBroadcast(function (data) {
      var report = [];
      var x = new Int32Array(data.x_sab); id6_R_t3 = x[0]; report.push("id6_R_t3: "+id6_R_t3);
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
      if (reports >= 3) break;
   }
}

report.sort();
report = report.join(";");
var outputs = [];
outputs[0] = "id6_R_t3: 0";
outputs[1] = "id6_R_t3: 2";
outputs[2] = "id6_R_t3: 512";
outputs[3] = "id6_R_t3: 514";
outputs[4] = "id6_R_t3: 131072";
outputs[5] = "id6_R_t3: 131074";
outputs[6] = "id6_R_t3: 131584";
outputs[7] = "id6_R_t3: 131586";
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrtmEFrwyAcxe/7FB5bKBg1dmOww8oou2yD7tBjGKSHwLrukJ5Gv/vUtEZaE2JitxbeTZ76r9Hfe1Ip
//3WzL721JKSnyabbISnFPEkrXm3z1qcTnGXkgP6Mi59kyK9lEjRKmNZ4Qpaa6zbUqTatSmWqvP4ovrXNn
//tKuLBj1tqNNUv1rzeEceX5/Iy9t1rNbo9RrdKrUqvapbQXgrCG8F4a1Q74irymO12t3FbG62d3TQ9YjD
//16mZiZ7d1MnaOnlbp/35+f5wPaOqEe9LPWJ3Q31Qc0ANqMOhHsLtcac9iKQD0mbRJ3M7gC4ZUAfqsfM7
//EHW74SwcdRGAegrUgXo46v2DOybo7hH2wx9JD/z/OentB/UwwH4ukh6oX37SDwHdn/Td8WeCJbcIezjg
//T59lTu1hl87DPSDDaEfeg/bY7zVBeT+EdX/eBzlA3sEBcEDsvG99qYnpABHDAVM4AA4Id0DfB5zz3wAC
//9wJccR33gvN3N6Yv3K3AvQAHXOy9cCb+W1+COrjiF0uqdWk=
