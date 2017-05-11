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
      for(i = 0; i <= 2; i++){
         var x = new Int8Array(data.x_sab); Atomics.store(x, i+1, i+0);
      }
      $262.agent.report(report);
      $262.agent.leaving();
   })
   `);

// Thread t2
$262.agent.start(
   `$262.agent.receiveBroadcast(function (data) {
      var report = [];
      for(i = 0; i <= 1; i++){
         var x = new Int16Array(data.x_sab); id4_R_t2 = Atomics.load(x, i); report.push("id4_R_t2_"+i+": "+id4_R_t2);
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
outputs[0] = "id4_R_t2_0: 0;id4_R_t2_1: 0";
outputs[1] = "id4_R_t2_0: 2;id4_R_t2_1: 0";
outputs[2] = "id4_R_t2_0: 0;id4_R_t2_1: 1";
outputs[3] = "id4_R_t2_0: 2;id4_R_t2_1: 1";
outputs[4] = "id4_R_t2_0: 0;id4_R_t2_1: 512";
outputs[5] = "id4_R_t2_0: 2;id4_R_t2_1: 512";
outputs[6] = "id4_R_t2_0: 0;id4_R_t2_1: 513";
outputs[7] = "id4_R_t2_0: 2;id4_R_t2_1: 513";
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrt2j9Pg0AYBvDdT3GjTUiOe9FF42BjGhc1qUNHYoIDibUOdDJ+d5F/cnBHgLtDC89meftSOPCXlydw
//fjgmH8eEcxZHF+E2TCj0r5h/XX0S6SfO94fo9S390v2a3bDP8ziicBcmwku7guyv0F95TLVdaLZTvr3s
//bncoKnKPYm/lGXi/Z1PsTaTf27/E7z+V/Fja2+UzUVT0PdSulMeirYjVF7t9vGMPT1hTe2vaWBm5o7Vd
//sS5yh6Ii2ium7NH/Dml7SHF/bNeb7AZpXIvy7NP+bB/6spDLolGm7nJQHsamuE01v6LbQ979vCu6h/6L
//nHE1UQSiQBSIOhWihIKo6oL4EwPlN2+HkXB18IQJCjyBp5OeoGoLL/4CKPnC2ycKExSIAlH/myjdiDQh
//UIo5aRKe5AlKgCfwBJ7mmkEFinLt4pBhBtWqVPvuk071nKBAFIgCUTPNoKwD1S+D6gcXZigABaCWnkK5
//IarHY54hUpiigBSQWkQOZUKUQQ5ldYq6FASiQBSIWtL7ULVLEDjKoshmFgWkgBSQWtQbUUZEmaVRhDkK
//RIEo5FETIGXwuEdj8igwBabA1KLejOqLlINEauQkFYAoEAWiZpVISbm4i0RKvrzuEykgBaSA1JwSKZdE
//dSZSA+nCHAWiQNRCEynnSOkf92wxhUkKTIGpOSdSlpAankgNJeobwWujtg==
