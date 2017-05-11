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
      var x = new Int8Array(data.x_sab); Atomics.store(x, 0, 0);
      var x = new Int8Array(data.x_sab); Atomics.store(x, 1, 0);
      var x = new Int8Array(data.x_sab); Atomics.store(x, 2, 0);
      $262.agent.report(report);
      $262.agent.leaving();
   })
   `);

// Thread t2
$262.agent.start(
   `$262.agent.receiveBroadcast(function (data) {
      var report = [];
      var x = new Int8Array(data.x_sab); Atomics.store(x, 1, 2);
      var x = new Int8Array(data.x_sab); Atomics.store(x, 2, 2);
      var x = new Int8Array(data.x_sab); Atomics.store(x, 3, 2);
      $262.agent.report(report);
      $262.agent.leaving();
   })
   `);

// Thread t3
$262.agent.start(
   `$262.agent.receiveBroadcast(function (data) {
      var report = [];
      var x = new Int32Array(data.x_sab); id8_R_t3 = Atomics.load(x, 0); report.push("id8_R_t3: "+id8_R_t3);
      var x = new Int16Array(data.x_sab); id9_R_t3 = Atomics.load(x, 1); report.push("id9_R_t3: "+id9_R_t3);
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
outputs[0] = "id8_R_t3: 0;id9_R_t3: 0";
outputs[1] = "id8_R_t3: 512;id9_R_t3: 0";
outputs[2] = "id8_R_t3: 131072;id9_R_t3: 0";
outputs[3] = "id8_R_t3: 131584;id9_R_t3: 0";
outputs[4] = "id8_R_t3: 33554432;id9_R_t3: 0";
outputs[5] = "id8_R_t3: 33554944;id9_R_t3: 0";
outputs[6] = "id8_R_t3: 33685504;id9_R_t3: 0";
outputs[7] = "id8_R_t3: 33686016;id9_R_t3: 0";
outputs[8] = "id8_R_t3: 0;id9_R_t3: 2";
outputs[9] = "id8_R_t3: 512;id9_R_t3: 2";
outputs[10] = "id8_R_t3: 131072;id9_R_t3: 2";
outputs[11] = "id8_R_t3: 131584;id9_R_t3: 2";
outputs[12] = "id8_R_t3: 33554432;id9_R_t3: 2";
outputs[13] = "id8_R_t3: 33554944;id9_R_t3: 2";
outputs[14] = "id8_R_t3: 33685504;id9_R_t3: 2";
outputs[15] = "id8_R_t3: 33686016;id9_R_t3: 2";
outputs[16] = "id8_R_t3: 0;id9_R_t3: 512";
outputs[17] = "id8_R_t3: 512;id9_R_t3: 512";
outputs[18] = "id8_R_t3: 131072;id9_R_t3: 512";
outputs[19] = "id8_R_t3: 131584;id9_R_t3: 512";
outputs[20] = "id8_R_t3: 33554432;id9_R_t3: 512";
outputs[21] = "id8_R_t3: 33554944;id9_R_t3: 512";
outputs[22] = "id8_R_t3: 33685504;id9_R_t3: 512";
outputs[23] = "id8_R_t3: 33686016;id9_R_t3: 512";
outputs[24] = "id8_R_t3: 0;id9_R_t3: 514";
outputs[25] = "id8_R_t3: 512;id9_R_t3: 514";
outputs[26] = "id8_R_t3: 131072;id9_R_t3: 514";
outputs[27] = "id8_R_t3: 131584;id9_R_t3: 514";
outputs[28] = "id8_R_t3: 33554432;id9_R_t3: 514";
outputs[29] = "id8_R_t3: 33554944;id9_R_t3: 514";
outputs[30] = "id8_R_t3: 33685504;id9_R_t3: 514";
outputs[31] = "id8_R_t3: 33686016;id9_R_t3: 514";
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrt3U2PG8cVRuF9fsUsI8CAyKnuJpkgixiBkU0SwFlkKQRQFgLiOAt5Nch/j2SNZUosdbOK9QXx2Q2a
//Q3HwauacvtW36r58+eNPb//709uXLx/evD6++v7V2/C7h93v37w+/fL1y5c//Pj6X/9+9w1//vbhDw9P
//v33z+vHVP1693X/z7h3h569efPPwydXp7GqIXp3ff/34/ury81efXz2cXV2iVz/8rO+vfvhJP1zdv/uO
//H/755j/vrz+efd759fCF69MXrs9nn3p+ffnC9cMXrh+/8HM+//z/e/jjX//08Je/ybhexp9leP6pv15d
//olcP0avH6L97/mkh+mkh+mkh+mkh+mkh+mlT9NOm6KdN0U+bop82RT/t19+lY/Tq+fcu0e9dot97iH7v
//4fPv/fAX8/233/38J/PJ7+sv//fv3rl7/+4vvbhfe/Fx7cXw/OJp7Z2n+Duff/Dvnv/Uo/9+/N0f3vn3
//fzy/MwUvv3kJ9VAP9VD/1aL+dpr/+uLHX/ddfdBHPjUZ/zAP8zAP8/d+R5+I+Y+/1vuWmA8wD/MyhnmY
//f6p2w94b8ud/YtAP/TKGfuivvGZ/6YWPv76PLeE/wTzMyxjmYf6pFMlX7vD7QD5+hw/90C9j6If+3Dv8
//K5bpe6M/QD/0yxj6oT8V/bct3Y95z99WB/P+kRAIgRAIQT/Ppy9+DLXpo97z/0qgB3oZAz3QV+zo6YP5
//+L0/+IO/jMEf/Euu+F+s7vSG/wT+4C9j8Af/ymv+w6F/u8+nvhD2Yb87cAIncAInaPL/7MWP8TV9Frxg
//PdbLGOuxvlmnfx/SxysA/Md/GeM//rdr9+/D/4D/+C9j/Mf/rj3/I939N3fCfJw4gRM4gRPusCa4ePTb
//2wpz9A8S//FfxviP/0VrguHov70XoL4TQpjnaQpWiliBFVjBuK7PXvwYVGhphgPao72M0R7tS0/sWikQ
//+rA+XgUwAAPImAEYoPjhPyvPhvsYIDAAA8iYARig2KlAeb1BI1UArMAKMmYFVmj0HGDlzIg+XpgYgAFk
//zAAMUOzZQN6ZQSPVBazACjJmBVYoVxekjIgZ82kBK7CCjFmBFZKsUGhsWCsn5E4Oa2SE02R3GSMwAiPc
//Y1/Ryv6yPpVCfCcZAzCAjBmAAQr3FQ3H/5T9xazACjJmBVbIqQtSxs2M2VXECqwgY1ZghVLPD0Z0Qu4U
//shZGWI7zvGMERmAERrjH/QcXh9D1rhQWBmAAGTMAA7TYfzAc/7cnlrECK8iYFVih2v6D4awQWIEVWIEV
//WKHX/oNuTsidYtbGCMtuvzACIzACI3yddULKCJsxdx+wAivImBVYoVSdMKITcieb1TfCjgqogAqowKCz
//zamap+tePGt0vbJIOG1ef/43VzB/hHmYh3mYN+Hs4Zb5yNUgH68GstAP8iAP8iDvsKHrIH/x6LgB5API
//g7yMQR7kn6rdrPdF/Hb3D/ADv4yBH/iLrdSH7YMlGqB/AnmQlzHIg/xTKY6nnB3U7e4e+IFfxsAP/Ll3
//9+HFLZNlGq/cAz/wyxj4gf8q8N+2ZD/i/X5bGcx7IyTpgA7oQA/P1rauBkqY1zddwTzMyxjmdfGUWufv
//AfntvbnQD/0yhn7ov3WlP2UGTOMuHuiHfhlDP/TXWOsfDPy5c79K6mAf9rsDIzACIzCCpv6to9oaWGFB
//eqSXMdIjfbPO/h6c357jhf7oL2P0R/+67f096B/QH/1ljP7o37XHf5w7/+ZGmI8mNTICIzDCPdYDKQNa
//Gjf5oz/6yxj90b9SPTAY+3PncpU0QgjzPE3BGhEncAInGMSVNZmxrBcOWI/1MsZ6rC89jWulOOhB+ngF
//gP/4L2P8x//ih/ysPBHuwf+A//gvY/zH/2Kn/+T1A41z988JnCBjTuCERuv/K6dD9LDChP/4L2P8x/9i
//zwTyzgYapybgBE6QMSdwQrmaIGUAzIhPCTiBE2TMCZyQ5IRCI8HaGCF3KlgjH5wme8n4gA/44B57iVZ2
//k/WoEuL7xvAf/2WM//hfuJdoMPqn7CXmBE6QMSdwQk5NkDJMZsROIk7gBBlzAieUem4wnhFyJ4y18MFy
//nOcdH/ABH/DBPe43uDhqrm+VsOA//ssY//G/xX6Dwei/PY2MEzhBxpzACdX2GwzmhMAJnMAJnMAJvfYb
//dDJC7oSyNj5YdvuFD/iAD/jg66wRUgbUjLjbgBM4QcacwAmlaoTxjJA7tay+D3ZnIngkAiIgAiIwxGyD
//+asvnjnmyhJhG+jP/+Y50ON/DjAP8zAP8+aXZU4+rgb5eDWQhX6QB3mQB3kHC10H+YuHxg0gH0Ae5GUM
//8iD/VO1mvS/itzt/gB/4ZQz8wF9spT5sHyXRAP0TyIO8jEEe5J9KcTzltKBud/fAD/wyBn7gz727Dy9u
//mSHTeOUe+IFfxsAP/FeB/7Yl+xHv99vKYN4/0gEd0AEd6OHZ2NTVQAlz0qYrmId5mId5XTzZJUEPyG/v
//zYV+6Jcx9EP/rSv9KVNfGnfxQD/0yxj6ob/GWv9g4M+d9VVSB/uw3x0YgREYgRE09W8d1NbACgvSI72M
//kR7pm3X29+D89vwu9Ed/GaM/+tdt7+9B/4D+6C9j9Ef/rj3+49z5NzfCfJwYgREYgRHusB5IGc/SuMkf
///dFfxuiP/pXqgcHYnzuXq6QRQpjnaQrWiDiBEzjBIK5Ccxlv8cIB67FexliP9aWnca0UBz1IH68A8B//
//ZYz/+F/8kJ+VJ8I9+B/wH/9ljP/4X+z0n7x+oHHu/jmBE2TMCZzQaP1/5XSIHlaY8B//ZYz/+F/smUDe
//2UDj1AScwAky5gROKFcTpAyAGfEpASdwgow5gROSnFBoJFgbI+ROBWvkg9NkLxkf8AEf3GMv0cpush5V
//QnzfGP7jv4zxH/8L9xINRv+UvcScwAky5gROyKkJUobJjNhJxAmcIGNO4IRSzw3GM0LuhLEWPliO87zj
//Az7gAz64x/0GF0fN9a0SFvzHfxnjP/632G8wGP23p5FxAifImBM4odp+g8GcEDiBEziBEzih136DTkbI
//nVDWxgfLbr/wAR/wAR98nTVCyoCaEXcbcAInyJgTOKFUjTCeEXKnltX3we5MBPOeCqiACqjAGLMt6kfe
//eYqp5MoiYRvph0ukx/8cgB7ogR7ozTDLnn5cDfPxiiAL/jAP8zAP844XuhbzF4+OG2A+wDzMyxjmYT7t
//FKG0G/a+kN/uAIJ+6Jcx9EN/wRX7sH2oRAP4TzAP8zKGeZjPXq9PusPvAfnts4GgH/plDP3Qn3aHH17c
//MlGm8Qo+9EO/jKEf+q9E/21L9yPe87fVwTsFEAIhEAIh6OfZ3ObVQApz0jYsoAd6GQO9jp4byoIemN/e
//rwv+4C9j8Af/21f8U2bBNO7oAX/wlzH4g3+dNf/B0J87A6ykEPZhvztwAidwAido8t8+wq2BFxasx3oZ
//Yz3WN+z070H67dle+I//MsZ//K/d7t+D/wH/8V/G+I//nXv+x7n7b+6E+ThxAidwAifcZU2QMsClcdM/
///uO/jPEf/6vVBIPRP3d2V0knhDDP0xSsFLECK7CCYV2Z0xvLmuGA9mgvY7RH+/ITu1YKhB6sj1cBDMAA
//MmYABqhw+M/Ks+EeBggMwAAyZgAGKHgqUF5v0DgVACuwgoxZgRWaPQdYOTOihxcmBmAAGTMAAxR8NpB3
//ZtA4dQErsIKMWYEVStYFKSNiRnxawAqsIGNWYIVEKxQaG9bGCbmTwxoZ4TTZXcYIjMAI99lXtLK/rEel
//EN9JxgAMIGMGYIDifUWD8T9lfzErsIKMWYEV8uqClHEzI3YVsQIryJgVWKHc84PxnJA7hayFEZbjPO8Y
//gREYgRHuc//BxSF0fSuFhQEYQMYMwABt9h8Mxv/tiWWswAoyZgVWqLj/YDArBFZgBVZgBVbot/+gkxNy
//p5i1McKy2y+MwAiMwAhfa52QMsJmxN0HrMAKMmYFVihXJ4znhNzJZvWNsKMCKqACKjDo7IrByacv97Le
//UiScoq2nqziP/ymAPMiDPMibb5Y9HbkS4uO1QAb4IR7iIR7iHTR0LeIvHhtXR3yAeIiXMcRD/FO1G/We
//gN/u+4F92Jcx7MN+sRX6sH2gRHXwTxAP8TKGeIh/KkXxlBODOt3Zwz7syxj2YT/3zj68uGWaTNMVe9iH
//fRnDPuxfhf3blurHu9dvqYJ3+CcDMiADMtC3s7mNq7oQ5ugmK5AHeRmDPMgX79xpj/jtnbjAD/wyBn7g
//v3WFP2XeS9POHeAHfhkDP/DXWOMfCvu5E77KyWAf9rsDH/ABH/CBJv7tI9mqO2HBeZyXMc7jfLNO/vaU
//357Whf3YL2Psx/667fzt2R+wH/tljP3Y37Wnf5S7/sY+mI8mMfIBH/DBfdYCKQNYmjb1Yz/2yxj7sb9S
//LTAU+XOnbpXzQQjzPE3B6hAjMAIjGLKVMnWxkhUOSI/0MkZ6pC89aWulMGjP+fjdP/qjv4zRH/2LH+az
//8hy4Pf0D+qO/jNEf/Yud8pPXAzTKnT8jMIKMGYERGq37r5wD0d4JE/qjv4zRH/2LPQvIOwNolHqAERhB
//xozACOXqgZTxLuM9HWAERpAxIzBCkhEKjftq4YPciV9NbHCa7BxjAzZgg/vsH1rZO9a+QojvEkN/9Jcx
//+qN/4f6hodifsm+YERhBxozACDn1QMqomPG6hxiBEWTMCIxQ6nnBaD7InR5W3wbLcZ53bMAGbMAG97m/
//4OJAuZ4VwoL+6C9j9Ef/FvsLhmL/9qQxRmAEGTMCI1TbXzCUEQIjMAIjMAIj9Npf0MUHudPHWthg2e0X
//NmADNmCDr7U+SBk/M97uAkZgBBkzAiOUqg9G80HuRLLaNth9ooGJBmiABmjAgLLoJMzTNTMt08uD08Yw
//ygjO438KIA/yIA/yZpNlTzSuhPh4JZABfoiHeIiHeAcIXYv4i0fF1REfIB7iZQzxEP9U7Ua9J+C3u31g
//H/ZlDPuwX2yFPmwfGlEd/BPEQ7yMIR7in0pRPOVUoE539rAP+zKGfdjPvbMPL26ZENN0xR72YV/GsA/7
//V2H/tqX68e71W6pg3j+SARmQARno29ncwlVdCHMU5yAP8jIGeZAv3rnTHvHb+3CBH/hlDPzAf+sKf8pM
//l6adO8AP/DIGfuCvscY/FPZz53iVk8E+7HcHPuADPuADTfzbx7FVd8KC8zgvY5zH+Wad/O0pvz2bC/ux
//X8bYj/112/nbsz9gP/bLGPuxv2tP/yh3/Y19MB8nPuADPuCDu6wFUoavNG3qx37slzH2Y3+lWmAo8ufO
//3CrngxDmeZqC1SFGYARGMGQrZeJiJSsckB7pZYz0SF960tZKYdCe8/G7f/RHfxmjP/oXP8xn5Tlwe/oH
//9Ed/GaM/+hc75SevB2iUO39GYAQZMwIjNFr3XzkHor0TJvRHfxmjP/oXexaQdwbQKPUAIzCCjBmBEcrV
//AynjXcZ7OsAIjCBjRmCEJCMUGvfVwge5E7+a2OA02TnGBmzABvfZP7Syd6x9hRDfJYb+6C9j9Ef/wv1D
//Q7E/Zd8wIzCCjBmBEXLqgZRRMeN1DzECI8iYERih1POC0XyQOz2svg2W4zzv2IAN2IAN7nN/wQXbe1YI
//C/qjv4zRH/1b7C8Yiv3bk8YYgRFkzAiMUG1/wVBGCIzACIzACIzQa39BFx/kTh9rYYNlt1/YgA3YgA2+
//1vogZfzMeLsLGIERZMwIjFCqPhjNB7kTycrZ4P9Jnr8i
