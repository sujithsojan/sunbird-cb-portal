import { Component, OnInit, Inject, OnDestroy, Output, EventEmitter } from '@angular/core'
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { HttpErrorResponse } from '@angular/common/http'
import { MatSnackBar } from '@angular/material'

// import { Observable, Subject } from 'rxjs'
import { debounceTime, distinctUntilChanged, startWith, takeUntil } from 'rxjs/operators'

import { UserProfileService } from '../../../user-profile/services/user-profile.service'
import { ConfigurationsService } from '@sunbird-cb/utils-v2'
import { Subject } from 'rxjs'

@Component({
  selector: 'ws-transfer-request',
  templateUrl: './transfer-request.component.html',
  styleUrls: ['./transfer-request.component.scss'],
})

export class TransferRequestComponent implements OnInit, OnDestroy {

  @Output() enableWithdraw = new EventEmitter<boolean>()
  transferRequestForm = new FormGroup({
    organization: new FormControl('', [Validators.required]),
    group: new FormControl('', [Validators.required]),
    designation: new FormControl('', [Validators.required]),
  })
  departmentData: any[] = []
  otherDetails = false
  deptFilterData: any[] = []
  // deptFilterData  : Observable<string[]>
  designationData: any[] = []
  private destroySubject$ = new Subject()
  isInValidOrgSelection:boolean = false

  constructor(
    public dialogRef: MatDialogRef<TransferRequestComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private userProfileService: UserProfileService,
    private matSnackBar: MatSnackBar,
    private configService: ConfigurationsService
  ) {
    if (this.data.portalProfile.professionalDetails && this.data.portalProfile.professionalDetails.length) {
      this.transferRequestForm.controls.group.setValue(this.data.portalProfile.professionalDetails[0].group)
      this.transferRequestForm.controls.designation.setValue(this.data.portalProfile.professionalDetails[0].designation || '')
    }
    if (this.data.portalProfile.employmentDetails) {
      this.transferRequestForm.controls.organization.setValue(this.data.portalProfile.employmentDetails.departmentName)
    }

    this.transferRequestForm.get('organization')!.valueChanges
      .subscribe((value: string) => {
        if (value !== this.data.portalProfile.employmentDetails.departmentName) {
          this.otherDetails = true
        } else {
          this.otherDetails = false
        }
      })

    if (this.transferRequestForm.get('organization')) {
      console.log(this.transferRequestForm.get('organization')!.valueChanges, "this.transferRequestForm.get('organization')!.valueChanges")
      this.transferRequestForm.get('organization')!.valueChanges
        .pipe(
          debounceTime(250),
          distinctUntilChanged(),
          startWith(''),
        )
        .subscribe(res => {
          if (res) {
            console.log(res, "response======")
            this.deptFilterData = this.departmentData &&
             this.departmentData.filter(item => item.toLowerCase().includes(res && res.toLowerCase()))
             const orgSearchVal = this.transferRequestForm.controls['organization']
             console.log(this.deptFilterData, "v-------------")
             console.log(this.deptFilterData.length, "his.deptFilterData.length-------------")
             if(this.deptFilterData && this.deptFilterData.length && this.deptFilterData.length > 0) {
              
              this.isInValidOrgSelection = false
              orgSearchVal.setErrors(null);
             } else {
              this.isInValidOrgSelection = true
            orgSearchVal.setErrors({ invalidSelection: true });
             }
          } else {
            this.deptFilterData = this.departmentData
          }
        })
    }

    

    if (this.transferRequestForm.get('designation')) {
      console.log(this.transferRequestForm.get('designation')!.valueChanges, "this.transferRequestForm.get('designation')!.valueChanges")
      
      this.transferRequestForm.get('designation')!.valueChanges
        .pipe(
          debounceTime(250),  
          distinctUntilChanged(),
          startWith(''),
        )
        .subscribe(res => {
          if (res) {
            console.log(res, "res==============")
            const designonData = this.data && this.data.designationsMeta
            this.designationData = designonData.filter((val: any) =>

              val && val.name.toLowerCase().includes(res && res.toLowerCase())
           
            
            )
            console.log(this.designationData, "this.designationData--------")
          } 
        })
    }

    // this.isValidAutocomplete()
  }

  ngOnInit() {
    this.getAllDeptData()
    
  }

  validateOrgAutocomplete(){
    const orgSearchVal = this.transferRequestForm.controls['organization']
    const orgsrch = orgSearchVal && orgSearchVal.value
    console.log(orgSearchVal.value)
    // const designonData = this.data && this.data.designationsMeta

    
    const isValid = this.departmentData &&
             this.departmentData.filter(item => item.toLowerCase().includes(orgsrch && orgsrch.toLowerCase()))
    // console.log(isValid, "isValid-------------")
    if(isValid) {
      // this.isNotValidOrgSelection = true
      orgSearchVal.setErrors(null);
    } else {
      // this.isNotValidOrgSelection = false
      orgSearchVal.setErrors({ invalidSelection: true });
    }
    // console.log(this.isNotValidOrgSelection, "this.isNotValidOrgSelection--")
  }

  isValidAutocomplete() {
    this.validateOrgAutocomplete()
    // console.log(this.isValidOrgSelection, "this.isValidOrgSelection======")
    return true
  } 
  handleCloseModal(): void {
    this.dialogRef.close()
  }

  organizationSearch(value: string) {
    const filterVal = value.toLowerCase()
    return this.departmentData.filter(option => option.toLowerCase().includes(filterVal))
  }

  searchOrg(value: any) {
    if (value && value.length) {
      this.departmentData = this.organizationSearch(value)
    } else {
      this.getAllDeptData()
    }
  }

  handleSubmitRequest(): void {
    console.log('bform submit=')
    debugger
    if (this.transferRequestForm.valid ) {

    const data: any = {
      'name': this.transferRequestForm.value['organization'],
      'designation': this.transferRequestForm.value['designation'],
      'group': this.transferRequestForm.value['group'],
    }
    const postData: any = {
      'request': {
        'userId': this.configService.unMappedUser.id,
        'employmentDetails': {
          'departmentName': this.transferRequestForm.value['organization'],
        },
        'profileDetails': {
          'professionalDetails': [],
        },
      },
    }
    postData.request.profileDetails.professionalDetails.push(data)
    this.userProfileService.editProfileDetails(postData)
      .pipe(takeUntil(this.destroySubject$))
      .subscribe((_res: any) => {
        this.matSnackBar.open('Your transfer request has been sent for approval')
        // this.matSnackBar.open(this.handleTranslateTo('transferRequestSent'))
        this.enableWithdraw.emit(true)
        this.handleCloseModal()
      },         (error: HttpErrorResponse) => {
        if (!error.ok) {
          this.matSnackBar.open(this.handleTranslateTo('transferRequestFailed'))
        }
      })
    }
  }

  getAllDeptData(): void {
    this.userProfileService.getAllDepartments()
      .pipe(takeUntil(this.destroySubject$))
      .subscribe((res: any) => {
        this.departmentData = res.sort((a: any, b: any) => {
          return a.toLowerCase().localeCompare(b.toLowerCase())
        })
      },         (error: HttpErrorResponse) => {
        if (!error.ok) {
          this.matSnackBar.open(this.handleTranslateTo('orgFetchDataFailed'))
        }
      })
  }

  handleTranslateTo(menuName: string): string {
    return this.userProfileService.handleTranslateTo(menuName)
  }

  ngOnDestroy(): void {
    this.destroySubject$.unsubscribe()
  }

}
