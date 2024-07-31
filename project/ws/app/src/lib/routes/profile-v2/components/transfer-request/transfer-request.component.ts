import { Component, OnInit, Inject, OnDestroy, Output, EventEmitter } from '@angular/core'
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { HttpErrorResponse } from '@angular/common/http'
import { MatSnackBar } from '@angular/material'

import {  Subject } from 'rxjs'
// import { debounceTime, distinctUntilChanged, startWith, takeUntil } from 'rxjs/operators'
import { takeUntil } from 'rxjs/operators'

import { UserProfileService } from '../../../user-profile/services/user-profile.service'
import { ConfigurationsService } from '@sunbird-cb/utils-v2'

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
  designationData: any[] = []
  otherDetails = false
  filteredDesignation: any[] = []
  searchControl: FormControl = new FormControl();
  
  // designationFilteredOptions: Observable<string[]>;

  private destroySubject$ = new Subject()

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
  }

  ngOnInit() {
    this.getAllDeptData()
    // this.searchDesg()
    this.searchDesignation('')
   
  }

  // searchDesg() {
  //   const designonData = this.data && this.data.designationsMeta
  //   if(this.transferRequestForm.get('designation')) {
  //      this.transferRequestForm.get('designation')!.valueChanges.pipe(
  //       debounceTime(250),
  //       distinctUntilChanged(),
  //       startWith(''),
  //     ).subscribe(res=> {
  //       if(res) {
  //         this.designationData = designonData.filter((val: any) =>
  //         val && val.name.toLowerCase().includes(res)
  //       )
  //       }
  //     })
  //   }
  // }


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

  // private filterOptions(searchTerm: string) {
  //   if (!searchTerm) {
  //     this.filteredDesignation = this.data && this.data.designationsMeta
  //   } else {
  //     const lowerCaseSearchTerm = searchTerm.toLowerCase();
  //     this.filteredDesignation = this.data.designationsMetas.filter((option:any) =>
  //       option.toLowerCase().includes(lowerCaseSearchTerm)
  //     );
  //   }
  // }

  designationSearch(value: any) {
    // let filterDesignation: any
    // const designonData = this.data && this.data.designationsMeta
    // const filterVal = value && value.toLowerCase()
    // if (!value) {
    //   this.filteredDesignation = designonData
    // } else {
    // this.filteredDesignation = designonData.filter((val: any) =>
    //   val && val.name.toLowerCase().includes(filterVal)
    // )
    // }
    // console.log(this.filteredDesignation, "this.filteredDesignation=========")
    // return filterDesignation
    let filterDesignation: any
    const designonData = this.data && this.data.designationsMeta
    const filterVal = value && value.toLowerCase()
    filterDesignation = designonData.filter((val: any) =>
      val && val.name.toLowerCase().includes(filterVal)
    )
    return filterDesignation
  }

  searchDesignation(value:any) {
    if (value && value.length && value.length > 0) {
      this.designationData = this.designationSearch(value)
    } 
    else {
      this.designationData = this.data && this.data.designationsMeta
    }
    // this.searchControl.valueChanges.subscribe(searchTerm => {
    //   this.designationSearch(searchTerm);
    // });
  }

  handleSubmitRequest(): void {
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
