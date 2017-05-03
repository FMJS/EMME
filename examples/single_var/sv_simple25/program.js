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
      var x = new Int8Array(data.x_sab); id2_R_t1 = Atomics.load(x, 0); report.push("id2_R_t1: "+id2_R_t1);
      var x = new Int8Array(data.x_sab); id3_R_t1 = Atomics.load(x, 0); report.push("id3_R_t1: "+id3_R_t1);
      $262.agent.report(report);
      $262.agent.leaving();
   })
   `);

// Thread t2
$262.agent.start(
   `$262.agent.receiveBroadcast(function (data) {
      var report = [];
      var x = new Int8Array(data.x_sab); id4_R_t2 = Atomics.load(x, 0); report.push("id4_R_t2: "+id4_R_t2);
      var x = new Int8Array(data.x_sab); id5_R_t2 = Atomics.load(x, 0); report.push("id5_R_t2: "+id5_R_t2);
      $262.agent.report(report);
      $262.agent.leaving();
   })
   `);

// Thread t3
$262.agent.start(
   `$262.agent.receiveBroadcast(function (data) {
      var report = [];
      var x = new Int8Array(data.x_sab); Atomics.store(x, 0, 1);
      var x = new Int8Array(data.x_sab); Atomics.store(x, 0, 2);
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
outputs[0] = "id2_R_t1: 0;id3_R_t1: 0;id4_R_t2: 0;id5_R_t2: 0";
outputs[1] = "id2_R_t1: 0;id3_R_t1: 1;id4_R_t2: 0;id5_R_t2: 0";
outputs[2] = "id2_R_t1: 1;id3_R_t1: 1;id4_R_t2: 0;id5_R_t2: 0";
outputs[3] = "id2_R_t1: 0;id3_R_t1: 2;id4_R_t2: 0;id5_R_t2: 0";
outputs[4] = "id2_R_t1: 1;id3_R_t1: 2;id4_R_t2: 0;id5_R_t2: 0";
outputs[5] = "id2_R_t1: 2;id3_R_t1: 2;id4_R_t2: 0;id5_R_t2: 0";
outputs[6] = "id2_R_t1: 0;id3_R_t1: 0;id4_R_t2: 0;id5_R_t2: 1";
outputs[7] = "id2_R_t1: 0;id3_R_t1: 1;id4_R_t2: 0;id5_R_t2: 1";
outputs[8] = "id2_R_t1: 1;id3_R_t1: 1;id4_R_t2: 0;id5_R_t2: 1";
outputs[9] = "id2_R_t1: 0;id3_R_t1: 2;id4_R_t2: 0;id5_R_t2: 1";
outputs[10] = "id2_R_t1: 1;id3_R_t1: 2;id4_R_t2: 0;id5_R_t2: 1";
outputs[11] = "id2_R_t1: 2;id3_R_t1: 2;id4_R_t2: 0;id5_R_t2: 1";
outputs[12] = "id2_R_t1: 0;id3_R_t1: 0;id4_R_t2: 1;id5_R_t2: 1";
outputs[13] = "id2_R_t1: 0;id3_R_t1: 1;id4_R_t2: 1;id5_R_t2: 1";
outputs[14] = "id2_R_t1: 1;id3_R_t1: 1;id4_R_t2: 1;id5_R_t2: 1";
outputs[15] = "id2_R_t1: 0;id3_R_t1: 2;id4_R_t2: 1;id5_R_t2: 1";
outputs[16] = "id2_R_t1: 1;id3_R_t1: 2;id4_R_t2: 1;id5_R_t2: 1";
outputs[17] = "id2_R_t1: 2;id3_R_t1: 2;id4_R_t2: 1;id5_R_t2: 1";
outputs[18] = "id2_R_t1: 0;id3_R_t1: 0;id4_R_t2: 0;id5_R_t2: 2";
outputs[19] = "id2_R_t1: 0;id3_R_t1: 1;id4_R_t2: 0;id5_R_t2: 2";
outputs[20] = "id2_R_t1: 1;id3_R_t1: 1;id4_R_t2: 0;id5_R_t2: 2";
outputs[21] = "id2_R_t1: 0;id3_R_t1: 2;id4_R_t2: 0;id5_R_t2: 2";
outputs[22] = "id2_R_t1: 1;id3_R_t1: 2;id4_R_t2: 0;id5_R_t2: 2";
outputs[23] = "id2_R_t1: 2;id3_R_t1: 2;id4_R_t2: 0;id5_R_t2: 2";
outputs[24] = "id2_R_t1: 0;id3_R_t1: 0;id4_R_t2: 1;id5_R_t2: 2";
outputs[25] = "id2_R_t1: 0;id3_R_t1: 1;id4_R_t2: 1;id5_R_t2: 2";
outputs[26] = "id2_R_t1: 1;id3_R_t1: 1;id4_R_t2: 1;id5_R_t2: 2";
outputs[27] = "id2_R_t1: 0;id3_R_t1: 2;id4_R_t2: 1;id5_R_t2: 2";
outputs[28] = "id2_R_t1: 1;id3_R_t1: 2;id4_R_t2: 1;id5_R_t2: 2";
outputs[29] = "id2_R_t1: 2;id3_R_t1: 2;id4_R_t2: 1;id5_R_t2: 2";
outputs[30] = "id2_R_t1: 0;id3_R_t1: 0;id4_R_t2: 2;id5_R_t2: 2";
outputs[31] = "id2_R_t1: 0;id3_R_t1: 1;id4_R_t2: 2;id5_R_t2: 2";
outputs[32] = "id2_R_t1: 1;id3_R_t1: 1;id4_R_t2: 2;id5_R_t2: 2";
outputs[33] = "id2_R_t1: 0;id3_R_t1: 2;id4_R_t2: 2;id5_R_t2: 2";
outputs[34] = "id2_R_t1: 1;id3_R_t1: 2;id4_R_t2: 2;id5_R_t2: 2";
outputs[35] = "id2_R_t1: 2;id3_R_t1: 2;id4_R_t2: 2;id5_R_t2: 2";
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrtm0Fr20AQhe/9FTq2EFC0sv2gpYeGEnppC+khR1NID4Gm6cE5lfz3xrEdK/Za1u7OjNbSu4m1tCvt
//iI+neX5lef+w+PuwKMvi9sbNr+aL6n1x/uH2pm4cT5bHbnU83RyX5d39za/fTxd+uSg+Fv/ebq4/KzZX
//vzsr3m6uXo6url2NzubX80W9HMXz0Wq0ejq++3n75+zlbvbH6wPjk8bszfHpgfHZgXXX9/NYfPr2ufj6
//fYjP9jy+faLm7NvRqXd05p2hOW/tnbf2zlt756298273euYdbZ479Z473T13VeOri8vnIr96os2uPV15
//vrz61W15ftzeh+fHqf/H9fKXe69Y46xD6x5a0r/aaqUf1+uVFF/FxzflMaRUY0XKzl2uVyVokkHjx4R/
///0Lg0ZyhI1LaahwOmpelTDHj3yINyHR53fY304+YiojZe/2adzNm8IRgw3mfPh0mzguTdMR0qLEXPHts
//scKOX+rJQycMLu3beFzVOCKn3l0V1DpCWidLVdNW43Ctg160DrLSOojQOgRPB4CPHkcj0DrBOGpRQOhB
//ASEjBdQVRI4gSnpJ3ajxNA4QuUg8oS88ISM8IQlPXZysamR42jTq+Sk2BH+rQ40t/a2GpFJ3t2ZNE0/c
//29rfzHhnqxpxD4jgkQePHzFa/aLoGtv5XSnYCWs8x0Nn0uZpBSGnInIiBPmYQeRHTjpctD7bhGts5X91
//wZCE+3UcQpNwjyta9Tgi6Pg+0g87MT9MuMZ2fliKFkKvWkjLCaMWIp7SFZK+6gkBkXCNrfyxeIWEHhVS
//DJgcwaTw0tIvy8cv67HGVn5ZF1yhR1zpO2XViHHVbgfw0y1X/yykp9ShxsL+2Z6q0nXPZm2xuETvrOs2
//hjlnFXtIBFG2IIKSc6YCopZGthKGZkf/0RALobQNDHPSKn6kEUxKYMoBQcI1FvTXErEU4q6FQElj68Kc
//NaqioN2l32bqt2k5a9E1FvXblLQSDLSSvtNGrURc9aeg9MFkUmNB/01FQUFdQcmByhFUZi8x/bhwPy4H
//5024xoJ+XCK+oI6vvpy45h8H3Dgzazv7yD7T6SfZgmpsmWSDYZINqkk2CCbZHDtPxNEg8m0CNbbLt8Es
//3wbFfBsE822OH3DE0yBSb2o1tkq9wSj1BrXUGwRTb1RIR/t21E0GuqkvhdShxnZZOJhl4WR0E8R0E/Ek
//nJOimopUU6egm2KhpZCQg1FCTkJNpeHKEVfW6SlC7Gij+xRwFV1jq9wcjHJzYRCDAsS65OYcc3PsSg0i
//TSdQY7s0HczSdFBM00EwTcfeFPE0jIydWo2tMnYwythBLWMHwYwdP/OIq2Ek74xrbJO8g0nyDkrJOwgm
//76igIv+rT1Bl4Pn1WGOrPB6M8ngQyOPpuH3UVYRYvmorHVc91tgmpQeTlB6SU3o67h/xZZzgoieo5Ame
//SI1tsnswye4hILtn6QY6uoGdXuIJu1on5BGq1VjYI4StRwhFjxAqHqFjh4vQGpxzaFxjUecQls4h1JxD
//qDiHjp+IhNjg/MQsaizoJ8LOT4SSnwgVP5FqS75NS3z1rcGyqLGoywhLl1FCg0FZgxFifThQRJudMsu4
//xoLeI+y8x3RlpgE1R6hl6UsRdV1RlxfUhGss6EjCzpEMQZ3G1v0H4daOpw==
